import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

/**
 * Comprehensive authentication debug endpoint
 * GET /api/auth/debug
 * 
 * This endpoint provides detailed information about:
 * - Environment configuration
 * - Database connectivity
 * - Auth handler availability
 * - Session state
 * - CORS and security headers
 */
export async function GET() {
  // Allow in production for debugging, but with limited info
  const debugInfo: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
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
    };
    
    debugInfo.environment_variables = envCheck;
    
    // 2. Calculate effective base URL
    const effectiveBaseUrl = process.env.BETTER_AUTH_URL || 
                            process.env.NEXT_PUBLIC_APP_URL || 
                            'http://localhost:3000';
    debugInfo.effective_base_url = effectiveBaseUrl;
    
    // 3. Check database connectivity
    const dbStatus = { connected: false, error: null as string | null, tables: {} as Record<string, unknown> };
    try {
      // Simple connectivity test
      await db.execute('SELECT 1 as test');
      dbStatus.connected = true;
      
      // Check auth tables
      const tables = ['user', 'session', 'account', 'verification'];
      for (const table of tables) {
        try {
          const countResult = await db.execute<{ count: number }>(`SELECT COUNT(*) as count FROM "${table}"`);
          dbStatus.tables[table] = {
            exists: true,
            count: countResult?.[0]?.count || 0
          };
        } catch (e) {
          dbStatus.tables[table] = {
            exists: false,
            error: e instanceof Error ? e.message : 'Unknown error'
          };
        }
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
        
        // Check if handler has expected methods
        const handlerMethods = auth.handler ? Object.keys(auth.handler) : [];
        debugInfo.auth_handler_methods = handlerMethods;
      }
    } catch (error) {
      authHandlerStatus.error = error instanceof Error ? error.message : 'Unknown error';
    }
    debugInfo.auth_handler = authHandlerStatus;
    
    // 5. Check session (if available)
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
        user: session.user,
        expiresAt: session.session.expiresAt
      } : null;
    } catch (error) {
      sessionStatus.error = error instanceof Error ? error.message : 'Unknown error';
    }
    debugInfo.session = sessionStatus;
    
    // 6. Check request headers
    const requestHeaders = await headers();
    const relevantHeaders = {
      'content-type': requestHeaders.get('content-type'),
      'accept': requestHeaders.get('accept'),
      'origin': requestHeaders.get('origin'),
      'referer': requestHeaders.get('referer'),
      'cookie': requestHeaders.get('cookie') ? 'PRESENT' : 'NOT_PRESENT',
      'x-forwarded-proto': requestHeaders.get('x-forwarded-proto'),
      'x-forwarded-host': requestHeaders.get('x-forwarded-host'),
    };
    debugInfo.request_headers = relevantHeaders;
    
    // 7. Test auth endpoints
    const authEndpoints = [
      '/api/auth/session',
      '/api/auth/sign-in',
      '/api/auth/sign-up',
      '/api/auth/sign-out',
      '/api/auth/callback/google',
    ];
    
    const endpointTests: Record<string, unknown> = {};
    for (const endpoint of authEndpoints) {
      const testUrl = `${effectiveBaseUrl}${endpoint}`;
      try {
        // Use OPTIONS to test endpoint availability without side effects
        const response = await fetch(testUrl, {
          method: 'OPTIONS',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        endpointTests[endpoint] = {
          url: testUrl,
          available: response.status !== 404,
          status: response.status,
          statusText: response.statusText,
          corsHeaders: {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
          }
        };
      } catch (error) {
        endpointTests[endpoint] = {
          url: testUrl,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    debugInfo.endpoint_tests = endpointTests;
    
    // 8. Configuration warnings
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
    
    // Check for URL mismatches in production
    if (process.env.NODE_ENV === 'production') {
      const origin = requestHeaders.get('origin');
      if (origin && !effectiveBaseUrl.includes(origin) && !origin.includes('localhost')) {
        warnings.push(`Origin mismatch: Request from ${origin} but base URL is ${effectiveBaseUrl}`);
      }
    }
    
    debugInfo.warnings = warnings;
    debugInfo.has_critical_issues = warnings.length > 0;
    
    // Add CORS headers for debugging
    const response = NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
    
    return response;
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}