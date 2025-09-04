/**
 * Auth Debug Utilities
 * Helper functions to diagnose Better Auth configuration issues
 */

export interface AuthConfigCheck {
  name: string;
  value: string | undefined;
  required: boolean;
  valid: boolean;
  message: string;
}

export function validateAuthConfiguration(): AuthConfigCheck[] {
  const checks: AuthConfigCheck[] = [];

  // Client-side environment variables
  const nextPublicBetterAuthUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  checks.push({
    name: 'NEXT_PUBLIC_BETTER_AUTH_URL',
    value: nextPublicBetterAuthUrl,
    required: false,
    valid: !nextPublicBetterAuthUrl || isValidUrl(nextPublicBetterAuthUrl),
    message: nextPublicBetterAuthUrl 
      ? isValidUrl(nextPublicBetterAuthUrl) 
        ? 'Valid URL format'
        : 'Invalid URL format'
      : 'Not set, using fallback'
  });

  const nextPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  checks.push({
    name: 'NEXT_PUBLIC_APP_URL',
    value: nextPublicAppUrl,
    required: false,
    valid: !nextPublicAppUrl || isValidUrl(nextPublicAppUrl),
    message: nextPublicAppUrl 
      ? isValidUrl(nextPublicAppUrl) 
        ? 'Valid URL format'
        : 'Invalid URL format'
      : 'Not set, using fallback'
  });

  // Check if we have at least one URL configured
  const hasValidBaseUrl = nextPublicBetterAuthUrl || nextPublicAppUrl;
  checks.push({
    name: 'Base URL Configuration',
    value: hasValidBaseUrl ? 'Configured' : 'Missing',
    required: true,
    valid: !!hasValidBaseUrl,
    message: hasValidBaseUrl 
      ? 'At least one base URL is configured'
      : 'No base URL configured - will use localhost:3000 fallback'
  });

  return checks;
}

export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function getEffectiveBaseUrl(): string {
  // Use production-first URL resolution logic matching auth-client.ts
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
           process.env.NEXT_PUBLIC_APP_URL || 
           (typeof window !== 'undefined' ? window.location.origin : "https://afarsemon.com");
  }
  
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
         process.env.NEXT_PUBLIC_APP_URL || 
         (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000");
}

export async function testAuthEndpoints(baseUrl: string = getEffectiveBaseUrl()) {
  const endpoints = [
    '/api/auth/session',
    '/api/auth/get-session',
    '/api/auth/callback/google',
  ];

  const results = [];

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      results.push({
        endpoint,
        url,
        status: response.status,
        statusText: response.statusText,
        available: response.status !== 404,
        headers: Object.fromEntries(response.headers.entries()),
        error: null
      });
    } catch (error) {
      results.push({
        endpoint,
        url,
        status: null,
        statusText: null,
        available: false,
        headers: null,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return results;
}

export function logAuthDebugInfo() {
  // Always log in production to help debug deployment issues
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.group(isProduction ? '🔧 Better Auth Production Debug Info' : '🔧 Better Auth Debug Info');
  
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Effective Base URL:', getEffectiveBaseUrl());
  console.log('Window Origin:', typeof window !== 'undefined' ? window.location.origin : 'Server-side');
  
  // Show all environment variables in production for debugging
  if (isProduction) {
    console.log('Environment Variables:', {
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
  }
  
  const configChecks = validateAuthConfiguration();
  console.table(configChecks);
  
  // Warn about localhost usage in production
  if (isProduction && getEffectiveBaseUrl().includes('localhost')) {
    console.error('⚠️ CRITICAL: Production is using localhost URL!');
    console.error('This will cause authentication failures.');
    console.error('Check your deployment environment variables.');
  }
  
  console.groupEnd();
}

// Auto-run debug logging in development and production (for deployment debugging)
if (typeof window !== 'undefined') {
  logAuthDebugInfo();
}