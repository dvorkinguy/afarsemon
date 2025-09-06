import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory store for development fallback
const memoryStore = new Map<string, { count: number; resetTime: number }>();

// Create a mock Redis interface for development
class MockRedis {
  private store = memoryStore;

  async evalsha(
    _sha: string,
    _keys: string[],
    _args: (string | number)[]
  ): Promise<[number, number]> {
    // In development mode, be more lenient with rate limiting
    if (process.env.NODE_ENV === 'development') {
      // Simple in-memory rate limiting logic with shorter windows for development
      const key = _keys[0];
      const limit = _args[0] as number;
      const window = Math.min(_args[1] as number, 10000); // Max 10 seconds in development
      const now = Date.now();
      
      const entry = this.store.get(key);
      
      if (!entry || now > entry.resetTime) {
        // Reset window
        this.store.set(key, { count: 1, resetTime: now + window });
        return [1, window];
      }
      
      if (entry.count >= limit) {
        // Rate limit exceeded
        return [0, entry.resetTime - now];
      }
      
      // Increment counter
      entry.count++;
      this.store.set(key, entry);
      return [1, entry.resetTime - now];
    }
    
    // Production logic (normal rate limiting)
    const key = _keys[0];
    const limit = _args[0] as number;
    const window = _args[1] as number;
    const now = Date.now();
    
    const entry = this.store.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Reset window
      this.store.set(key, { count: 1, resetTime: now + window });
      return [1, window];
    }
    
    if (entry.count >= limit) {
      // Rate limit exceeded
      return [0, entry.resetTime - now];
    }
    
    // Increment counter
    entry.count++;
    this.store.set(key, entry);
    return [1, entry.resetTime - now];
  }

  // Add other required methods that Upstash Ratelimit might use
  async get(): Promise<string | null> {
    return null;
  }

  async set(): Promise<string> {
    return 'OK';
  }

  async expire(): Promise<number> {
    return 1;
  }
}

// Create Redis instance for rate limiting
// In production, this should use Upstash Redis credentials
// In development, it can use a mock or local redis
const hasRedisConfig = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : (() => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Rate Limit] Using in-memory fallback (development mode)');
      } else {
        console.warn('[Rate Limit] Redis not configured, using in-memory fallback');
      }
      return new MockRedis() as unknown as Redis;
    })();

// Create rate limiters for different endpoint types
export const createRateLimiter = (
  requests: number,
  window: string,
  prefix: string = 'rl'
) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    prefix,
  });
};

// Pre-configured rate limiters for different endpoint types
export const rateLimiters = {
  // Webhooks: 10 requests per minute
  webhook: createRateLimiter(10, '1 m', 'rl:webhook'),
  
  // Chat: 20 requests per minute
  chat: createRateLimiter(20, '1 m', 'rl:chat'),
  
  // Auth: 5 requests per minute (stricter for security)
  auth: createRateLimiter(5, '1 m', 'rl:auth'),
  
  // Debug: 3 requests per minute (very restrictive)
  debug: createRateLimiter(3, '1 m', 'rl:debug'),
  
  // General API: 50 requests per minute
  general: createRateLimiter(50, '1 m', 'rl:general'),
  
  // Strict rate limit for sensitive operations: 2 requests per minute
  strict: createRateLimiter(2, '1 m', 'rl:strict'),
};

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cloudflare = request.headers.get('cf-connecting-ip');
  
  if (cloudflare) return cloudflare;
  if (real) return real;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Development helper to clear rate limit cache
export function clearRateLimitCache(): void {
  if (process.env.NODE_ENV === 'development') {
    memoryStore.clear();
    console.log('[Rate Limit] Development cache cleared');
  }
}

// Rate limiting response helper
export function createRateLimitResponse(
  success: boolean,
  limit: number,
  remaining: number,
  reset: Date
) {
  if (success) {
    return {
      success: true,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.getTime().toString(),
      },
    };
  }

  return {
    success: false,
    error: 'Rate limit exceeded',
    status: 429,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': reset.getTime().toString(),
      'Retry-After': Math.ceil((reset.getTime() - Date.now()) / 1000).toString(),
    },
  };
}