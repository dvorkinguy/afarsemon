import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { postgresClient } from '@/lib/db';
import { headers } from 'next/headers';
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse
} from '@/lib/security';

/**
 * Comprehensive authentication debug endpoint
 * GET /api/auth/debug
 * 
 * SECURITY: Requires admin authentication in production
 * Available in development without auth, but with rate limiting
 */
export async function GET(request: NextRequest) {
  // In production, require admin authentication
  // In development, allow but with strict rate limiting
  const validation = await validateRequest(request, {
    requireAdmin: process.env.NODE_ENV === 'production',
    rateLimitType: 'debug', // 3 requests per minute
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  const debugInfo: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    requestedBy: validation.user?.email || 'anonymous',
  };

  try {
    // 1. Check environment variables (mask sensitive values)
    const envCheck = {
      // Public URLs
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT_SET',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'NOT_SET',
      
      // OAuth Configuration (check existence only)
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      
      // Auth Secret (check existence only)
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT_SET',
      
      // Database (check existence only)
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT_SET',
      
      // Rate limiting
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT_SET',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT_SET',
    };
    
    debugInfo.environment_variables = envCheck;
    
    // 2. Calculate effective base URL
    const effectiveBaseUrl = process.env.BETTER_AUTH_URL || 
                            process.env.NEXT_PUBLIC_APP_URL || 
                            'http://localhost:3000';
    debugInfo.effective_base_url = effectiveBaseUrl;
    
    // 3. Check database connectivity (limited info in production)
    const dbStatus = { connected: false, error: null as string | null, tables: {} as Record<string, unknown> };
    try {
      // Simple connectivity test using raw postgres client
      await postgresClient`SELECT 1 as test`;
      dbStatus.connected = true;
      
      // Only show table info in development
      if (process.env.NODE_ENV === 'development') {
        const tables = ['user', 'session', 'account', 'verification'];
        for (const table of tables) {
          try {
            const countResult = await postgresClient`SELECT COUNT(*) as count FROM ${postgresClient(table)}`;
            dbStatus.tables[table] = {
              exists: true,
              count: Number(countResult?.[0]?.count) || 0
            };
          } catch (e) {
            dbStatus.tables[table] = {
              exists: false,
              error: e instanceof Error ? e.message : 'Unknown error'
            };
          }
        }
      } else {
        dbStatus.tables = { note: 'Table details hidden in production' };
      }
    } catch (error) {
      dbStatus.connected = false;
      dbStatus.error = error instanceof Error ? error.message : 'Unknown database error';
    }
    debugInfo.database = dbStatus;
    
    // 4. Check Better Auth handler
    const authHandlerStatus = { available: false, error: null as string | null };
    try {
      if (auth && auth.handler) {
        authHandlerStatus.available = true;
        
        // Only show handler methods in development
        if (process.env.NODE_ENV === 'development') {
          const handlerMethods = auth.handler ? Object.keys(auth.handler) : [];
          debugInfo.auth_handler_methods = handlerMethods;
        }
      }
    } catch (error) {
      authHandlerStatus.error = error instanceof Error ? error.message : 'Unknown error';
    }
    debugInfo.auth_handler = authHandlerStatus;
    
    // 5. Check current session
    const sessionStatus = { 
      checked: false, 
      session: null as { user: unknown; expiresAt: unknown } | null, 
      error: null as string | null 
    };
    try {
      const requestHeaders = await headers();
      const session = await auth.api.getSession({ headers: requestHeaders });
      sessionStatus.checked = true;
      sessionStatus.session = session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        },
        expiresAt: session.session.expiresAt
      } : null;
    } catch (error) {
      sessionStatus.error = error instanceof Error ? error.message : 'Unknown error';
    }
    debugInfo.session = sessionStatus;
    
    // 6. Configuration warnings
    const warnings: string[] = [];
    
    if (!envCheck.BETTER_AUTH_SECRET || envCheck.BETTER_AUTH_SECRET === 'NOT_SET') {
      warnings.push('BETTER_AUTH_SECRET is not set - authentication will not work');
    }
    
    if (!envCheck.GOOGLE_CLIENT_ID || envCheck.GOOGLE_CLIENT_ID === 'NOT_SET') {
      warnings.push('GOOGLE_CLIENT_ID is not set - Google OAuth will not work');
    }
    
    if (!envCheck.GOOGLE_CLIENT_SECRET || envCheck.GOOGLE_CLIENT_SECRET === 'NOT_SET') {
      warnings.push('GOOGLE_CLIENT_SECRET is not set - Google OAuth will not work');
    }
    
    if (!dbStatus.connected) {
      warnings.push('Database connection failed - authentication data cannot be stored');
    }
    
    if (!authHandlerStatus.available) {
      warnings.push('Auth handler not available - authentication routes will not work');
    }
    
    // Check for rate limiting setup
    if (!envCheck.UPSTASH_REDIS_REST_URL || envCheck.UPSTASH_REDIS_REST_URL === 'NOT_SET') {
      warnings.push('Upstash Redis not configured - using in-memory rate limiting (not recommended for production)');
    }
    
    debugInfo.warnings = warnings;
    debugInfo.has_critical_issues = warnings.length > 0;
    
    return createSecureResponse(debugInfo);
    
  } catch (error) {
    console.error('[Debug] Debug endpoint error:', error);
    return createErrorResponse(
      'Debug information unavailable',
      500,
      error
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(_request: NextRequest) {
  return createSecureResponse(null, 200, {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
}