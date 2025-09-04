import { NextResponse } from 'next/server';
import { getServerEnv } from '@afarsemon/env';

export async function GET() {
  try {
    const serverEnv = getServerEnv();
    
    const config = {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      
      // URL Configuration
      urls: {
        BETTER_AUTH_URL: serverEnv.BETTER_AUTH_URL,
        NEXT_PUBLIC_BETTER_AUTH_URL: serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
        NEXT_PUBLIC_APP_URL: serverEnv.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_WWW_URL: serverEnv.NEXT_PUBLIC_WWW_URL,
        resolved_base_url: serverEnv.BETTER_AUTH_URL || 
                          serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL || 
                          serverEnv.NEXT_PUBLIC_APP_URL || 
                          "http://localhost:3000"
      },
      
      // Configuration Status
      status: {
        hasBetterAuthSecret: !!serverEnv.BETTER_AUTH_SECRET,
        hasGoogleClientId: !!serverEnv.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!serverEnv.GOOGLE_CLIENT_SECRET,
        hasPostgresUrl: !!serverEnv.POSTGRES_URL,
        hasSupabaseUrl: !!serverEnv.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!serverEnv.SUPABASE_SERVICE_ROLE_KEY
      },
      
      // Expected Configuration for Production
      production_checks: {
        correct_base_url: serverEnv.BETTER_AUTH_URL === 'https://afarsemon.com' ||
                         serverEnv.NEXT_PUBLIC_BETTER_AUTH_URL === 'https://afarsemon.com',
        correct_app_url: serverEnv.NEXT_PUBLIC_APP_URL === 'https://afarsemon.com',
        has_production_secret: serverEnv.BETTER_AUTH_SECRET && 
                              serverEnv.BETTER_AUTH_SECRET !== 'qtD4Ssa0t5jY7ewALgai97sKhAtn7Ysc', // This is the dev secret
        oauth_configured: !!serverEnv.GOOGLE_CLIENT_ID && !!serverEnv.GOOGLE_CLIENT_SECRET,
        database_configured: !!serverEnv.POSTGRES_URL
      }
    };
    
    // Calculate overall health
    const allProductionChecks = Object.values(config.production_checks);
    const passedChecks = allProductionChecks.filter(Boolean).length;
    const totalChecks = allProductionChecks.length;
    
    const response = {
      status: 'ok' as const,
      health: passedChecks === totalChecks ? 'healthy' as const : 'issues_detected' as const,
      score: `${passedChecks}/${totalChecks}`,
      config,
      recommendations: [] as string[]
    };
    
    // Add recommendations for failing checks
    if (!config.production_checks.correct_base_url) {
      response.recommendations.push('Set BETTER_AUTH_URL or NEXT_PUBLIC_BETTER_AUTH_URL to https://afarsemon.com');
    }
    if (!config.production_checks.correct_app_url) {
      response.recommendations.push('Set NEXT_PUBLIC_APP_URL to https://afarsemon.com');
    }
    if (!config.production_checks.has_production_secret) {
      response.recommendations.push('Generate a new BETTER_AUTH_SECRET for production');
    }
    if (!config.production_checks.oauth_configured) {
      response.recommendations.push('Configure Google OAuth credentials');
    }
    if (!config.production_checks.database_configured) {
      response.recommendations.push('Configure PostgreSQL database URL');
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Config check error:', error);
    
    return NextResponse.json({
      status: 'error',
      health: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to load server environment configuration'
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}