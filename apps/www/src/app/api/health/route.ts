import { NextResponse } from "next/server";

export async function GET() {
  // Get environment information for debugging
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    
    // Public URLs
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_WWW_URL: process.env.NEXT_PUBLIC_WWW_URL,
    
    // Server-side URLs (check if they're set)
    hasBETTER_AUTH_URL: !!process.env.BETTER_AUTH_URL,
    hasBETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
    
    // OAuth Configuration
    hasGOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    hasGOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    
    // Database
    hasPOSTGRES_URL: !!process.env.POSTGRES_URL,
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasNEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Current time for cache verification
    timestamp: new Date().toISOString(),
    
    // Request headers for debugging
    headers: {
      host: null as string | null,
      origin: null as string | null,
      referer: null as string | null
    }
  };

  try {
    // Try to get request headers safely
    const { headers } = await import("next/headers");
    const headersList = await headers();
    envInfo.headers.host = headersList.get("host");
    envInfo.headers.origin = headersList.get("origin");
    envInfo.headers.referer = headersList.get("referer");
  } catch (e) {
    console.error("Failed to get headers:", e);
  }

  return NextResponse.json({
    status: "healthy",
    environment: envInfo,
    message: "API is running"
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}