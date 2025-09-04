/**
 * Production Environment Variable Override
 * 
 * This module ensures that production environment variables take precedence
 * over development variables, especially when dealing with localhost URLs
 * that might be loaded from symlinked .env.local files.
 */

// Production URL mappings - these should always be used in production
const PRODUCTION_URL_OVERRIDES = {
  'http://localhost:3000': 'https://afarsemon.com',
  'localhost:3000': 'https://afarsemon.com',
  'localhost': 'https://afarsemon.com'
} as const;

/**
 * Resolves environment variables with production-first priority
 * Filters out localhost URLs when in production environment
 */
export function getProductionSafeUrl(envVar: string | undefined, fallback: string): string {
  if (!envVar) {
    return fallback;
  }

  // In production, replace any localhost URLs with production URLs
  if (process.env.NODE_ENV === 'production') {
    // Check if the URL contains localhost and replace it
    for (const [localUrl, prodUrl] of Object.entries(PRODUCTION_URL_OVERRIDES)) {
      if (envVar.includes(localUrl)) {
        console.warn(`[Prod URL Override] Replacing ${envVar} with ${prodUrl}`);
        return prodUrl;
      }
    }
  }

  return envVar;
}

/**
 * Gets production-safe environment variables with proper fallbacks
 */
export function getProductionEnvVars() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Force production URLs when in production environment
  const betterAuthUrl = isProduction 
    ? getProductionSafeUrl(process.env.BETTER_AUTH_URL, 'https://afarsemon.com')
    : process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    
  const publicBetterAuthUrl = isProduction 
    ? getProductionSafeUrl(process.env.NEXT_PUBLIC_BETTER_AUTH_URL, 'https://afarsemon.com')
    : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';
    
  const publicAppUrl = isProduction 
    ? getProductionSafeUrl(process.env.NEXT_PUBLIC_APP_URL, 'https://afarsemon.com')
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    BETTER_AUTH_URL: betterAuthUrl,
    NEXT_PUBLIC_BETTER_AUTH_URL: publicBetterAuthUrl,
    NEXT_PUBLIC_APP_URL: publicAppUrl,
    isProduction,
    originalVars: {
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    }
  };
}

/**
 * Production-aware base URL resolver
 */
export function resolveProductionBaseURL(): string {
  const prodVars = getProductionEnvVars();
  
  if (prodVars.isProduction) {
    // In production, prioritize production URLs
    return prodVars.BETTER_AUTH_URL || 
           prodVars.NEXT_PUBLIC_BETTER_AUTH_URL || 
           prodVars.NEXT_PUBLIC_APP_URL || 
           'https://afarsemon.com';
  }
  
  // In development, allow localhost
  return prodVars.BETTER_AUTH_URL || 
         prodVars.NEXT_PUBLIC_BETTER_AUTH_URL || 
         prodVars.NEXT_PUBLIC_APP_URL || 
         'http://localhost:3000';
}