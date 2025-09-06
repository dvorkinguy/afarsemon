import { NextRequest } from "next/server";
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse
} from '@/lib/security';

/**
 * Health check endpoint
 * GET /api/health
 * 
 * SECURITY: Public endpoint with rate limiting
 * Limited information exposure based on environment
 */
export async function GET(request: NextRequest) {
  // Apply basic security validation without requiring authentication
  // This is a health endpoint that should be accessible for monitoring
  const validation = await validateRequest(request, {
    requireAuth: false, // Public endpoint
    rateLimitType: 'general', // 50 requests per minute
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    // Basic health information - safe to expose
    const healthInfo = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      message: "API is running"
    };

    // In development, provide more detailed information
    if (process.env.NODE_ENV === 'development') {
      const detailedInfo = {
        ...healthInfo,
        details: {
          // Environment info (safe for development)
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: process.env.VERCEL,
          VERCEL_ENV: process.env.VERCEL_ENV,
          VERCEL_URL: process.env.VERCEL_URL,
          
          // Public URLs
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
          NEXT_PUBLIC_WWW_URL: process.env.NEXT_PUBLIC_WWW_URL,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          
          // Configuration status (existence only)
          configuration: {
            hasBETTER_AUTH_URL: !!process.env.BETTER_AUTH_URL,
            hasBETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
            hasGOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
            hasGOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
            hasPOSTGRES_URL: !!process.env.POSTGRES_URL,
            hasNEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasSUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            hasUPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
            hasUPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
          }
        }
      };
      
      return createSecureResponse(detailedInfo, 200, {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    // In production, only return basic health status
    return createSecureResponse(healthInfo, 200, {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

  } catch (error) {
    console.error('[Security] Health check error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Health check unavailable',
      500,
      error
    );
  }
}