/**
 * Idempotency manager for form submissions.
 *
 * Prevents double-processing when users double-click submit or network
 * retries trigger duplicate requests.
 *
 * Supports distributed Redis REST API (Upstash / Vercel KV) with seamless
 * fallback to an in-memory TTL store.
 */

interface IdempotencyRecord {
  status: "processing" | "completed";
  expiresAt: number;
}

const localIdempotencyStore = new Map<string, IdempotencyRecord>();
const IDEMPOTENCY_TTL_SEC = 15 * 60; // 15 minutes

function cleanLocalIdempotency() {
  const now = Date.now();
  for (const [key, record] of localIdempotencyStore.entries()) {
    if (record.expiresAt <= now) {
      localIdempotencyStore.delete(key);
    }
  }
}

export async function checkIdempotency(
  key: string,
): Promise<"new" | "processing" | "completed"> {
  if (!key || key.length < 8) return "new";

  const remoteUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const remoteToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (remoteUrl && remoteToken) {
    try {
      const redisKey = `idempotency:enquiry:${key}`;
      const url = `${remoteUrl.replace(/\/$/, "")}/get/${encodeURIComponent(redisKey)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1200);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${remoteToken}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as { result?: string | null };
        if (data.result === "completed") return "completed";
        if (data.result === "processing") return "processing";
      }
    } catch (err) {
      console.warn("[idempotency] Remote lookup failed, falling back to local", err);
    }
  }

  cleanLocalIdempotency();
  const entry = localIdempotencyStore.get(key);
  if (!entry || entry.expiresAt <= Date.now()) {
    return "new";
  }
  return entry.status;
}

export async function claimIdempotency(key: string): Promise<boolean> {
  if (!key || key.length < 8) return true;

  const remoteUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const remoteToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (remoteUrl && remoteToken) {
    try {
      const redisKey = `idempotency:enquiry:${key}`;
      // SET key processing NX EX 120 (locks key for 2 mins while processing)
      const url = `${remoteUrl.replace(/\/$/, "")}/set/${encodeURIComponent(
        redisKey,
      )}/processing/nx/ex/120`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1200);

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${remoteToken}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as { result?: string | null };
        return data.result === "OK";
      }
    } catch (err) {
      console.warn("[idempotency] Remote lock failed", err);
    }
  }

  cleanLocalIdempotency();
  const entry = localIdempotencyStore.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return false;
  }

  localIdempotencyStore.set(key, {
    status: "processing",
    expiresAt: Date.now() + 120_000,
  });
  return true;
}

export async function completeIdempotency(key: string): Promise<void> {
  if (!key || key.length < 8) return;

  const remoteUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const remoteToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (remoteUrl && remoteToken) {
    try {
      const redisKey = `idempotency:enquiry:${key}`;
      const url = `${remoteUrl.replace(/\/$/, "")}/set/${encodeURIComponent(
        redisKey,
      )}/completed/ex/${IDEMPOTENCY_TTL_SEC}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1200);

      await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${remoteToken}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return;
    } catch (err) {
      console.warn("[idempotency] Remote complete failed", err);
    }
  }

  localIdempotencyStore.set(key, {
    status: "completed",
    expiresAt: Date.now() + IDEMPOTENCY_TTL_SEC * 1000,
  });
}

export async function releaseIdempotency(key: string): Promise<void> {
  if (!key || key.length < 8) return;

  const remoteUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const remoteToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (remoteUrl && remoteToken) {
    try {
      const redisKey = `idempotency:enquiry:${key}`;
      const url = `${remoteUrl.replace(/\/$/, "")}/del/${encodeURIComponent(redisKey)}`;
      await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${remoteToken}` },
      });
      return;
    } catch {
      // Ignore cleanup error
    }
  }

  localIdempotencyStore.delete(key);
}

