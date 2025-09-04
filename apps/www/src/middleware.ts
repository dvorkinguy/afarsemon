import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add CORS headers for auth endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Set CORS headers for production
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://afarsemon.com',
      'https://www.afarsemon.com',
      'https://manage.afarsemon.com',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  // For all other requests, just pass through
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Exclude static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};