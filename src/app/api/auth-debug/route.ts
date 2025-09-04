import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Diagnostic information to help debug auth issues
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      urls: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      },
      oauth: {
        GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID_PREFIX: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...",
      },
      database: {
        POSTGRES_URL_EXISTS: !!process.env.POSTGRES_URL,
        POSTGRES_URL_HOST: process.env.POSTGRES_URL ? 
          new URL(process.env.POSTGRES_URL).hostname : null,
      },
      auth: {
        BETTER_AUTH_SECRET_EXISTS: !!process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_SECRET_LENGTH: process.env.BETTER_AUTH_SECRET?.length || 0,
      }
    };

    return NextResponse.json(diagnostics, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate auth diagnostics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}