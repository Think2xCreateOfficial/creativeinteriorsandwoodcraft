/**
 * Production-grade rate limiter.
 *
 * Designed for serverless and multi-instance deployments (Vercel, Node, etc.).
 * Supports distributed Redis REST API (Upstash Redis or Vercel KV) when
 * credentials are provided via environment variables:
 * - UPSTASH_REDIS_REST_URL / KV_REST_API_URL
 * - UPSTASH_REDIS_REST_TOKEN / KV_REST_API_TOKEN
 *
 * If remote credentials are not configured or the service is temporarily
 * unreachable, it safely falls back to a local memory cache with time-based
 * eviction and fails open on unexpected errors.
 */

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_REQUESTS = 5;

// Local fallback store with automatic cleanup to prevent memory leaks
interface MemoryEntry {
  count: number;
  resetAt: number;
}
const localCache = new Map<string, MemoryEntry>();
let lastCleanup = Date.now();

function cleanupLocalCache() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  for (const [key, entry] of localCache.entries()) {
    if (entry.resetAt <= now) {
      localCache.delete(key);
    }
  }
}

function checkLocalRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  cleanupLocalCache();
  const now = Date.now();
  const entry = localCache.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    localCache.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);
  return {
    success: entry.count <= maxRequests,
    remaining,
    resetAt: entry.resetAt,
  };
}

async function checkRemoteRateLimit(
  url: string,
  token: string,
  key: string,
  maxRequests: number,
  windowSec: number,
): Promise<RateLimitResult | null> {
  const redisKey = `ratelimit:enquiry:${key}`;
  const now = Date.now();
  const resetAt = now + windowSec * 1000;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    // Atomic pipeline: INCR + EXPIRE (if new key)
    const pipelineUrl = `${url.replace(/\/$/, "")}/pipeline`;
    const response = await fetch(pipelineUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, windowSec, "NX"],
      ]),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(
        `[rate-limit] Remote rate limit returned status ${response.status}`,
      );
      return null;
    }

    const data = (await response.json()) as Array<{ result?: unknown }>;
    const currentCount = Number(data?.[0]?.result);

    if (Number.isFinite(currentCount)) {
      return {
        success: currentCount <= maxRequests,
        remaining: Math.max(0, maxRequests - currentCount),
        resetAt,
      };
    }

    return null;
  } catch (error) {
    console.warn("[rate-limit] Remote check failed, failing over to local", error);
    return null;
  }
}

export async function rateLimit(
  identifier: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult> {
  const remoteUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const remoteToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (remoteUrl && remoteToken) {
    const windowSec = Math.ceil(windowMs / 1000);
    const remoteResult = await checkRemoteRateLimit(
      remoteUrl,
      remoteToken,
      identifier,
      maxRequests,
      windowSec,
    );

    if (remoteResult !== null) {
      return remoteResult;
    }
  }

  // Fallback to local memory limiter
  return checkLocalRateLimit(identifier, maxRequests, windowMs);
}

