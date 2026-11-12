import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

import { normalizeEnquiry, validateEnquiry } from "@/lib/enquiry";
import { rateLimit } from "@/lib/rate-limit";
import {
  checkIdempotency,
  claimIdempotency,
  completeIdempotency,
  releaseIdempotency,
} from "@/lib/idempotency";

export const runtime = "nodejs";

type Enquiry = ReturnType<typeof normalizeEnquiry> & {
  receivedAt: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function enquiryEmailHtml(enquiry: Enquiry) {
  const rows = [
    ["Name", enquiry.name],
    ["Phone", enquiry.phone],
    ["Email", enquiry.email],
    ["Service", enquiry.service],
    ["Project location", enquiry.location || "Not provided"],
    ["Received", enquiry.receivedAt],
  ];

  return `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#242424;line-height:1.6">
      <h2 style="font-family:Georgia,serif;font-weight:400;margin:0 0 16px">New project enquiry</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#77736E;font-size:13px">${escapeHtml(label)}</td><td style="padding:4px 0;font-size:14px">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <div style="border-top:1px solid #D9D4CB;padding-top:16px;white-space:pre-wrap;font-size:14px">${escapeHtml(
        enquiry.description,
      )}</div>
    </div>
  `;
}

async function sendEmail(enquiry: Enquiry, apiKey: string, to: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.ENQUIRY_FROM_EMAIL ??
          "Website Enquiries <onboarding@resend.dev>",
        to: [to],
        reply_to: enquiry.email,
        subject: `New enquiry — ${enquiry.name} · ${enquiry.service}`,
        html: enquiryEmailHtml(enquiry),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Resend responded with status ${response.status}: ${errText.slice(0, 200)}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function sendWebhook(enquiry: Enquiry, url: string) {
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-webhook-secret": secret } : {}),
      },
      body: JSON.stringify({
        type: "project.enquiry",
        ...enquiry,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Webhook responded with status ${response.status}: ${errText.slice(0, 200)}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Development-only safety net so a developer can test locally without
 * needing live external credentials.
 */
async function persistLocallyDevOnly(enquiry: Enquiry) {
  try {
    const directory = path.join(process.cwd(), ".data");
    await fs.mkdir(directory, { recursive: true });
    await fs.appendFile(
      path.join(directory, "enquiries.jsonl"),
      `${JSON.stringify(enquiry)}\n`,
      "utf8",
    );
    console.info("[enquiry-dev] Enqueued to .data/enquiries.jsonl");
  } catch (err) {
    console.warn("[enquiry-dev] Could not write to local filesystem:", err);
  }
}

export async function POST(request: Request) {
  // Validate Content-Type
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported media type. JSON body required." },
      { status: 415 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const raw = (payload ?? {}) as Record<string, unknown>;

  // Anti-spam 1: Honeypot check — silently accept obvious bots without triggering delivery
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Anti-spam 2: Submission elapsed time check
  // Real humans take at least 1.5s to fill the form.
  // Missing, non-numeric, negative, or suspiciously fast (<1500ms) elapsed times are silently accepted.
  if (
    raw.elapsedMs === undefined ||
    raw.elapsedMs === null ||
    typeof raw.elapsedMs !== "number" ||
    !Number.isFinite(raw.elapsedMs) ||
    raw.elapsedMs < 1500
  ) {
    return NextResponse.json({ ok: true });
  }

  // Same-origin guard for browser submissions
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          { error: "This request was blocked." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "This request was blocked." },
        { status: 403 },
      );
    }
  }

  const input = normalizeEnquiry(payload);
  const errors = validateEnquiry(input);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields and try again.",
        fields: errors,
      },
      { status: 422 },
    );
  }

  // Rate limiting across instances
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");
  const ip = (cfIp || realIp || forwarded?.split(",")[0]?.trim() || "local").slice(0, 45);

  const rateLimitResult = await rateLimit(ip);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error:
          "We have received several enquiries from this connection. Please call us directly.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (rateLimitResult.resetAt - Date.now()) / 1000,
          ).toString(),
        },
      },
    );
  }

  // Idempotency: Prevent duplicate submissions
  const idempotencyKey =
    input.idempotencyKey ||
    `${input.phone.replace(/\D/g, "")}-${input.service}-${Math.floor(Date.now() / 180000)}`;

  const idempotencyState = await checkIdempotency(idempotencyKey);
  if (idempotencyState === "completed") {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  if (idempotencyState === "processing") {
    return NextResponse.json(
      {
        error:
          "Your enquiry is currently being processed. Please give us a moment.",
      },
      { status: 409 },
    );
  }

  const claimed = await claimIdempotency(idempotencyKey);
  if (!claimed) {
    return NextResponse.json(
      {
        error:
          "Your enquiry is currently being processed. Please give us a moment.",
      },
      { status: 409 },
    );
  }

  const enquiry: Enquiry = {
    ...input,
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const notificationEmail =
    process.env.ENQUIRY_NOTIFICATION_EMAIL?.trim() || "interiorscreative083@gmail.com";
  const isProduction = process.env.NODE_ENV === "production";

  // In production, require at least one verified durable delivery target
  const hasEmail = Boolean(resendKey && notificationEmail);
  const hasWebhook = Boolean(webhookUrl);

  if (isProduction && !hasEmail && !hasWebhook) {
    await releaseIdempotency(idempotencyKey);
    console.error(
      "[enquiry] Critical: No durable enquiry delivery destination configured in production (set ENQUIRY_WEBHOOK_URL or RESEND_API_KEY + ENQUIRY_NOTIFICATION_EMAIL).",
    );
    return NextResponse.json(
      {
        error:
          "Online enquiry submission is temporarily unavailable. Please call or WhatsApp us directly.",
      },
      { status: 503 },
    );
  }

  // Execute delivery to configured channels with partial failure tracking
  const deliveryTasks: Array<{ name: string; promise: Promise<void> }> = [];

  if (hasEmail) {
    deliveryTasks.push({
      name: "email",
      promise: sendEmail(enquiry, resendKey!, notificationEmail!),
    });
  }

  if (hasWebhook) {
    deliveryTasks.push({
      name: "webhook",
      promise: sendWebhook(enquiry, webhookUrl!),
    });
  }

  // Development local fallback when no external keys are configured
  if (!hasEmail && !hasWebhook) {
    await persistLocallyDevOnly(enquiry);
    await completeIdempotency(idempotencyKey);
    return NextResponse.json({ ok: true });
  }

  const settlements = await Promise.allSettled(
    deliveryTasks.map((t) => t.promise),
  );

  const succeeded: string[] = [];
  const failed: Array<{ channel: string; reason: string }> = [];

  settlements.forEach((result, idx) => {
    const channelName = deliveryTasks[idx].name;
    if (result.status === "fulfilled") {
      succeeded.push(channelName);
    } else {
      failed.push({
        channel: channelName,
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    }
  });

  // If at least one durable destination succeeded:
  if (succeeded.length > 0) {
    await completeIdempotency(idempotencyKey);

    if (failed.length > 0) {
      console.warn(
        `[enquiry] Partial delivery failure. Succeeded: [${succeeded.join(", ")}]. Failed: [${failed.map((f) => `${f.channel}: ${f.reason}`).join("; ")}]`,
      );
    }

    return NextResponse.json({ ok: true });
  }

  // All configured destinations failed
  await releaseIdempotency(idempotencyKey);
  console.error(
    `[enquiry] All delivery destinations failed: ${failed.map((f) => `${f.channel}: ${f.reason}`).join("; ")}`,
  );

  return NextResponse.json(
    {
      error:
        "We could not send your enquiry just now. Please call or WhatsApp us — we would love to hear about your project.",
    },
    { status: 502 },
  );
}
