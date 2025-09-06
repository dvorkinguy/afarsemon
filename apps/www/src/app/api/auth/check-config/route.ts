import { NextRequest } from 'next/server';
import { getServerEnv } from '@afarsemon/env';
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse
} from '@/lib/security';

/**
 * Authentication configuration check endpoint
 * GET /api/auth/check-config
 * 
 * SECURITY: Requires authentication for detailed config info
 * Public access with limited information for basic health checks
 */
export async function GET(request: NextRequest) {
  // Apply security validation
  // Allow public access but provide more details for authenticated users
  const validation = await validateRequest(request, {
    requireAuth: false, // Public endpoint but authenticated users get more info
    rateLimitType: 'general', // 50 requests per minute
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    const serverEnv = getServerEnv();
    const isAuthenticated = !!validation.user;
    
    // Basic configuration info (safe for public)
    const basicConfig = {
      status: 'ok' as const,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      isAuthenticated,
      
      // Basic URL configuration
      urls: {
        NEXT_PUBLIC_APP_URL: serverEnv.NEXT_PUBLIC_APP_URL || 'NOT_SET',
        NEXT_PUBLIC_BETTER_AUTH_URL: serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT_SET',
        resolved_base_url: serverEnv.BETTER_AUTH_URL || 
                          serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 
                          serverEnv.NEXT_PUBLIC_APP_URL || 
                          "http://localhost:3000"
      },
      
      // Basic status checks (safe for public)
      basicStatus: {
        hasConfiguration: !!(serverEnv.BETTER_AUTH_SECRET && serverEnv.GOOGLE_CLIENT_ID),
        hasDatabaseUrl: !!serverEnv.POSTGRES_URL,
        isProduction: process.env.NODE_ENV === 'production',
      }
    };

    // If not authenticated, return basic info only
    if (!isAuthenticated) {
      return createSecureResponse({
        ...basicConfig,
        health: basicConfig.basicStatus.hasConfiguration ? 'healthy' as const : 'issues_detected' as const,
        message: 'Basic configuration status (authenticate for detailed information)'
      }, 200, {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    // Security: Log authenticated config access for monitoring
    console.log('[Security] Auth config check requested:', {
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // Detailed configuration for authenticated users
    const detailedConfig = {
      ...basicConfig,
      requestedBy: validation.user?.email || 'unknown',
      
      // Detailed URL Configuration
      urls: {
        ...basicConfig.urls,
        BETTER_AUTH_URL: serverEnv.BETTER_AUTH_URL || 'NOT_SET',
        NEXT_PUBLIC_WWW_URL: serverEnv.NEXT_PUBLIC_WWW_URL || 'NOT_SET',
      },
      
      // Detailed Configuration Status
      status: {
        hasBetterAuthSecret: !!serverEnv.BETTER_AUTH_SECRET,
        hasGoogleClientId: !!serverEnv.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!serverEnv.GOOGLE_CLIENT_SECRET,
        hasPostgresUrl: !!serverEnv.POSTGRES_URL,
        hasSupabaseUrl: !!serverEnv.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!serverEnv.SUPABASE_SERVICE_ROLE_KEY,
        hasUpstashRedis: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      },
      
      // Production readiness checks
      production_checks: {
        correct_base_url: serverEnv.BETTER_AUTH_URL === 'https://afarsemon.com' ||
                         serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL === 'https://afarsemon.com',
        correct_app_url: serverEnv.NEXT_PUBLIC_APP_URL === 'https://afarsemon.com',
        has_production_secret: serverEnv.BETTER_AUTH_SECRET && 
                              serverEnv.BETTER_AUTH_SECRET !== 'qtD4Ssa0t5jY7ewALgai97sKhAtn7Ysc', // Dev secret
        oauth_configured: !!serverEnv.GOOGLE_CLIENT_ID && !!serverEnv.GOOGLE_CLIENT_SECRET,
        database_configured: !!serverEnv.POSTGRES_URL,
        rate_limiting_configured: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      }
    };
    
    // Calculate overall health
    const allProductionChecks = Object.values(detailedConfig.production_checks);
    const passedChecks = allProductionChecks.filter(Boolean).length;
    const totalChecks = allProductionChecks.length;
    
    const response = {
      ...detailedConfig,
      health: passedChecks === totalChecks ? 'healthy' as const : 'issues_detected' as const,
      score: `${passedChecks}/${totalChecks}`,
      recommendations: [] as string[]
    };
    
    // Add recommendations for failing checks
    if (!detailedConfig.production_checks.correct_base_url) {
      response.recommendations.push('Set BETTER_AUTH_URL or NEXT_PUBLIC_BETTER_AUTH_URL to https://afarsemon.com');
    }
    if (!detailedConfig.production_checks.correct_app_url) {
      response.recommendations.push('Set NEXT_PUBLIC_APP_URL to https://afarsemon.com');
    }
    if (!detailedConfig.production_checks.has_production_secret) {
      response.recommendations.push('Generate a new BETTER_AUTH_SECRET for production');
    }
    if (!detailedConfig.production_checks.oauth_configured) {
      response.recommendations.push('Configure Google OAuth credentials');
    }
    if (!detailedConfig.production_checks.database_configured) {
      response.recommendations.push('Configure PostgreSQL database URL');
    }
    if (!detailedConfig.production_checks.rate_limiting_configured && process.env.NODE_ENV === 'production') {
      response.recommendations.push('Configure Upstash Redis for production rate limiting');
    }
    
    return createSecureResponse(response, 200, {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
  } catch (error) {
    console.error('[Security] Config check error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Configuration check failed',
      500,
      error
    );
  }
}