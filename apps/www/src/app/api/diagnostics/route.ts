import { NextRequest } from "next/server";
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse
} from '@/lib/security';

type StatusLevel = "ok" | "warn" | "error";

interface DiagnosticsResponse {
  timestamp: string;
  requestedBy: string;
  env: {
    POSTGRES_URL: boolean;
    BETTER_AUTH_SECRET: boolean;
    GOOGLE_CLIENT_ID: boolean;
    GOOGLE_CLIENT_SECRET: boolean;
    GEMINI_API_KEY: boolean;
    NEXT_PUBLIC_APP_URL: boolean;
    UPSTASH_REDIS_REST_URL: boolean;
    UPSTASH_REDIS_REST_TOKEN: boolean;
  };
  database: {
    connected: boolean;
    schemaApplied: boolean;
    error?: string;
  };
  auth: {
    configured: boolean;
    routeResponding: boolean | null;
  };
  ai: {
    configured: boolean;
  };
  security: {
    rateLimitingConfigured: boolean;
    middlewareActive: boolean;
  };
  overallStatus: StatusLevel;
}

/**
 * System diagnostics endpoint
 * GET /api/diagnostics
 * 
 * SECURITY: Requires admin authentication in production
 * Available to authenticated users in development with rate limiting
 */
export async function GET(request: NextRequest) {
  // In production, require admin authentication
  // In development, allow authenticated users but with rate limiting
  const validation = await validateRequest(request, {
    requireAdmin: process.env.NODE_ENV === 'production',
    requireAuth: true, // Always require authentication
    rateLimitType: 'debug', // 3 requests per minute (strict for diagnostics)
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    // Security: Log diagnostics access for monitoring
    console.log('[Security] Diagnostics requested:', {
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    const env = {
      POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
      BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET),
      GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
      NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
      UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    } as const;

    // Database checks
    let dbConnected = false;
    let schemaApplied = false;
    let dbError: string | undefined;
    
    if (env.POSTGRES_URL) {
      try {
        const [{ db }, { sql }, schema] = await Promise.all([
          import("@/lib/db"),
          import("drizzle-orm"),
          import("@/lib/schema"),
        ]);
        
        // Ping DB
        await db.execute(sql`select 1`);
        dbConnected = true;
        
        try {
          // Touch a known table to verify migrations
          await db.select().from(schema.user).limit(1);
          schemaApplied = true;
        } catch {
          schemaApplied = false;
        }
      } catch (err) {
        dbConnected = false;
        dbError = err instanceof Error ? err.message : "Unknown database error";
      }
    } else {
      dbConnected = false;
      schemaApplied = false;
      dbError = "POSTGRES_URL is not set";
    }

    // Auth route check: we consider the route responding if it returns any HTTP response
    const origin = (() => {
      try {
        return new URL(request.url).origin;
      } catch {
        return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      }
    })();

    let authRouteResponding: boolean | null = null;
    try {
      const res = await fetch(`${origin}/api/auth/session`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      authRouteResponding = res.status >= 200 && res.status < 500;
    } catch {
      authRouteResponding = false;
    }

    const authConfigured = env.BETTER_AUTH_SECRET && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;
    const aiConfigured = env.GEMINI_API_KEY;
    const rateLimitingConfigured = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN;

    const overallStatus: StatusLevel = (() => {
      if (!env.POSTGRES_URL || !dbConnected || !schemaApplied) return "error";
      if (!authConfigured) return "error";
      if (!rateLimitingConfigured && process.env.NODE_ENV === 'production') return "warn";
      if (!aiConfigured) return "warn";
      return "ok";
    })();

    const response: DiagnosticsResponse = {
      timestamp: new Date().toISOString(),
      requestedBy: validation.user?.email || 'unknown',
      env,
      database: {
        connected: dbConnected,
        schemaApplied,
        error: dbError,
      },
      auth: {
        configured: authConfigured,
        routeResponding: authRouteResponding,
      },
      ai: {
        configured: aiConfigured,
      },
      security: {
        rateLimitingConfigured,
        middlewareActive: true, // Our middleware is always active
      },
      overallStatus,
    };

    return createSecureResponse(response);

  } catch (error) {
    console.error('[Security] Diagnostics error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Diagnostics information unavailable',
      500,
      error
    );
  }
}