import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SECURITY_HEADERS } from '@/lib/security'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Block debug endpoints in production
  if (process.env.NODE_ENV === 'production') {
    const url = request.nextUrl.pathname
    
    // Block debug and test endpoints in production
    const blockedPaths = [
      '/api/auth/debug',
      '/api/auth/test-db',
      '/api/auth/test-session',
      '/api/debug/env'
    ]
    
    if (blockedPaths.some(path => url.startsWith(path))) {
      console.warn(`[Security] Blocked access to debug endpoint in production: ${url}`)
      return new NextResponse(
        JSON.stringify({ error: 'Not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...SECURITY_HEADERS
          }
        }
      )
    }
  }
  
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://afarsemon.com')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }
  
  // Log production requests for monitoring
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/api/')) {
    console.log('[Security] API Request:', {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      timestamp: new Date().toISOString()
    })
  }
  
  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Run on all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}