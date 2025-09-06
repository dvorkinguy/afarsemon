import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { rateLimiters, getClientIdentifier, checkRateLimit } from "@/lib/rate-limit";
import { sanitizeErrorMessage } from "@/lib/validation";

type StatusLevel = "ok" | "warn" | "error";

interface DiagnosticsResponse {
  timestamp: string;
  env: {
    POSTGRES_URL: boolean;
    BETTER_AUTH_SECRET: boolean;
    GOOGLE_CLIENT_ID: boolean;
    GOOGLE_CLIENT_SECRET: boolean;
    GEMINI_API_KEY: boolean;
    NEXT_PUBLIC_APP_URL: boolean;
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
  overallStatus: StatusLevel;
}

export async function GET(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    // SECURITY FIX: Add authentication check for production
    // In development, allow access without auth for easier debugging
    if (isProduction) {
      await requireAdmin(req);
    }
    
    // Rate limiting for diagnostics endpoint
    const clientId = getClientIdentifier(req);
    const rateLimitResult = await checkRateLimit(rateLimiters.diagnostics, clientId);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.reset || 0).toISOString(),
          }
        }
      );
    }
    
    // SECURITY FIX: Limit information exposure in production
    const env = isProduction ? {
      // In production, only show if variables are set (not their values)
      POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
      BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET),
      GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
      NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    } : {
      // In development, show more detailed info
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
        // In production, don't expose detailed database errors
        dbError = isProduction 
          ? "Database connection failed" 
          : (err instanceof Error ? err.message : "Unknown database error");
      }
    } else {
      dbConnected = false;
      schemaApplied = false;
      dbError = "POSTGRES_URL is not set";
    }

  // Auth route check: we consider the route responding if it returns any HTTP response
  // for /api/auth/session (status codes in the 2xx-4xx range are acceptable for readiness)
  const origin = (() => {
    try {
      return new URL(req.url).origin;
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

  const authConfigured =
    env.BETTER_AUTH_SECRET && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;
  const aiConfigured = env.GEMINI_API_KEY; // We avoid live-calling the AI provider here

  const overallStatus: StatusLevel = (() => {
    if (!env.POSTGRES_URL || !dbConnected || !schemaApplied) return "error";
    if (!authConfigured) return "error";
    // AI is optional; warn if not configured
    if (!aiConfigured) return "warn";
    return "ok";
  })();

    const body: DiagnosticsResponse = {
      timestamp: new Date().toISOString(),
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
      overallStatus,
    };

    return NextResponse.json(body, {
      status: 200,
    });
  } catch (error) {
    // Improved error handling
    const errorMessage = sanitizeErrorMessage(error, isDevelopment);
    
    if (isDevelopment) {
      console.error('Diagnostics error:', error);
    }
    
    // Determine appropriate status code
    let statusCode = 500;
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        statusCode = 401;
      } else if (error.message.includes('Forbidden')) {
        statusCode = 403;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
