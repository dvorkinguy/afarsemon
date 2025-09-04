import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log environment variables for debugging in production
  if (process.env.NODE_ENV === 'production') {
    console.log('[Middleware] Production Environment Check:', {
      host: request.headers.get('host'),
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        hasOriginalBetterAuthUrl: !!process.env.BETTER_AUTH_URL,
        originalBetterAuthUrl: process.env.BETTER_AUTH_URL,
        hasPublicBetterAuthUrl: !!process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
        publicBetterAuthUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      }
    });
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}