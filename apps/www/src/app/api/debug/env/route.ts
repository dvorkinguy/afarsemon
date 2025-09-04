import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@afarsemon/env';

export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with proper auth header
    const authHeader = request.headers.get('x-debug-auth');
    const isDev = process.env.NODE_ENV === 'development';
    const isAuthorized = authHeader === 'debug-env-2024' || isDev;
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const serverEnv = getServerEnv();
    
    // Create a safe version of environment variables for debugging
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      environment: {
        // URLs
        NEXT_PUBLIC_APP_URL: serverEnv.NEXT_PUBLIC_APP_URL || 'NOT_SET',
        BETTER_AUTH_URL: serverEnv.BETTER_AUTH_URL || 'NOT_SET',
        NEXT_PUBLIC_BETTER_AUTH_URL: serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT_SET',
        NEXT_PUBLIC_WWW_URL: serverEnv.NEXT_PUBLIC_WWW_URL || 'NOT_SET',
        NEXT_PUBLIC_DASHBOARD_URL: serverEnv.NEXT_PUBLIC_DASHBOARD_URL || 'NOT_SET',
        
        // Database
        hasPostgresUrl: !!serverEnv.POSTGRES_URL,
        postgresUrlPrefix: serverEnv.POSTGRES_URL?.substring(0, 20) + '...' || 'NOT_SET',
        
        // Supabase
        NEXT_PUBLIC_SUPABASE_URL: serverEnv.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
        hasSupabaseAnonKey: !!serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!serverEnv.SUPABASE_SERVICE_ROLE_KEY,
        
        // Better Auth
        hasBetterAuthSecret: !!serverEnv.BETTER_AUTH_SECRET,
        betterAuthSecretLength: serverEnv.BETTER_AUTH_SECRET?.length || 0,
        
        // OAuth
        hasGoogleClientId: !!serverEnv.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!serverEnv.GOOGLE_CLIENT_SECRET,
        googleClientIdPrefix: serverEnv.GOOGLE_CLIENT_ID?.substring(0, 20) + '...' || 'NOT_SET',
        
        // AI Services
        hasGeminiApiKey: !!serverEnv.GEMINI_API_KEY,
        geminiModel: serverEnv.GEMINI_MODEL || 'NOT_SET',
      },
      // Raw environment variables inspection (filtered for security)
      processEnv: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
        // Add other non-sensitive vars as needed
      },
      resolvedUrls: {
        baseURL: getBaseURL(),
        serverBaseURL: getServerBaseURL(),
        isLocalhost: getBaseURL().includes('localhost'),
        isProduction: process.env.NODE_ENV === 'production',
      }
    };

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error) {
    console.error('Environment debug error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load environment variables',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
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