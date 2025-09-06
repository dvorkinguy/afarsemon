import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Create Redis client for rate limiting
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables
 */
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

/**
 * Rate limiter configurations for different API endpoints
 */
export const rateLimiters = {
  // General API rate limit: 100 requests per minute
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 m"),
        analytics: true,
        prefix: "rl:api",
      })
    : null,

  // Webhook rate limit: 50 requests per minute (more restrictive)
  webhook: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(50, "1 m"),
        analytics: true,
        prefix: "rl:webhook",
      })
    : null,

  // Chat API rate limit: 20 requests per minute (AI is expensive)
  chat: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 m"),
        analytics: true,
        prefix: "rl:chat",
      })
    : null,

  // Auth rate limit: 10 requests per minute (prevent brute force)
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        analytics: true,
        prefix: "rl:auth",
      })
    : null,

  // Diagnostics rate limit: 5 requests per minute (sensitive endpoint)
  diagnostics: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
        prefix: "rl:diagnostics",
      })
    : null,
};

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (works with proxies/Vercel)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a generic identifier if no IP is available
  return "anonymous";
}

/**
 * Rate limit check function
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!limiter) {
    // If rate limiting is not configured, allow the request
    console.warn("Rate limiting is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
    return { success: true };
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  
  return { success, limit, remaining, reset };
}