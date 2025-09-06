import { NextRequest } from 'next/server';
import { getServerEnv } from '@afarsemon/env';
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse
} from '@/lib/security';

/**
 * Environment debug endpoint
 * GET /api/debug/env
 * 
 * SECURITY: Requires admin authentication in production
 * Available in development without auth, but with strict rate limiting
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

  try {
    const serverEnv = getServerEnv();
    
    // Create a safe version of environment variables for debugging
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      requestedBy: validation.user?.email || 'anonymous',
      environment: {
        // URLs
        NEXT_PUBLIC_APP_URL: serverEnv.NEXT_PUBLIC_APP_URL || 'NOT_SET',
        BETTER_AUTH_URL: serverEnv.BETTER_AUTH_URL || 'NOT_SET',
        NEXT_PUBLIC_BETTER_AUTH_URL: serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT_SET',
        NEXT_PUBLIC_WWW_URL: serverEnv.NEXT_PUBLIC_WWW_URL || 'NOT_SET',
        NEXT_PUBLIC_DASHBOARD_URL: serverEnv.NEXT_PUBLIC_DASHBOARD_URL || 'NOT_SET',
        
        // Database (existence check only)
        hasPostgresUrl: !!serverEnv.POSTGRES_URL,
        postgresUrlPrefix: serverEnv.POSTGRES_URL?.substring(0, 20) + '...' || 'NOT_SET',
        
        // Supabase (existence check only)
        NEXT_PUBLIC_SUPABASE_URL: serverEnv.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
        hasSupabaseAnonKey: !!serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!serverEnv.SUPABASE_SERVICE_ROLE_KEY,
        
        // Better Auth (existence check only)
        hasBetterAuthSecret: !!serverEnv.BETTER_AUTH_SECRET,
        betterAuthSecretLength: serverEnv.BETTER_AUTH_SECRET?.length || 0,
        
        // OAuth (existence check only)
        hasGoogleClientId: !!serverEnv.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!serverEnv.GOOGLE_CLIENT_SECRET,
        googleClientIdPrefix: serverEnv.GOOGLE_CLIENT_ID?.substring(0, 20) + '...' || 'NOT_SET',
        
        // AI Services (existence check only)
        hasGeminiApiKey: !!serverEnv.GEMINI_API_KEY,
        geminiModel: serverEnv.GEMINI_MODEL || 'NOT_SET',
        
        // Rate limiting
        hasUpstashRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        hasUpstashRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
      resolvedUrls: {
        baseURL: getBaseURL(),
        serverBaseURL: getServerBaseURL(),
        isLocalhost: getBaseURL().includes('localhost'),
        isProduction: process.env.NODE_ENV === 'production',
      },
      // Only show process env details in development
      processEnvSample: process.env.NODE_ENV === 'development' ? {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      } : { note: 'Process environment details hidden in production' }
    };

    return createSecureResponse(debugInfo);

  } catch (error) {
    console.error('[Debug] Environment debug error:', error);
    return createErrorResponse(
      'Environment information unavailable',
      500,
      error
    );
  }
}

// Helper functions to test URL resolution logic
function getBaseURL(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.BETTER_AUTH_URL || 
           process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
           process.env.NEXT_PUBLIC_APP_URL || 
           "https://afarsemon.com";
  }
  
  return process.env.BETTER_AUTH_URL || 
         process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
         process.env.NEXT_PUBLIC_APP_URL || 
         "http://localhost:3000";
}

function getServerBaseURL(): string {
  const serverEnv = getServerEnv();
  
  if (process.env.NODE_ENV === 'production') {
    return serverEnv.BETTER_AUTH_URL || 
           serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 
           serverEnv.NEXT_PUBLIC_APP_URL || 
           "https://afarsemon.com";
  }
  
  return serverEnv.BETTER_AUTH_URL || 
         serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 
         serverEnv.NEXT_PUBLIC_APP_URL || 
         "http://localhost:3000";
}