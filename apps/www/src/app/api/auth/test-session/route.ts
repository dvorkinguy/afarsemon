import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse,
  requireDevelopment
} from '@/lib/security';

/**
 * Test endpoint to verify session functionality
 * GET /api/auth/test-session
 * 
 * SECURITY: Only available in development environment
 */
export async function GET(request: NextRequest) {
  // Check if development environment
  const devCheck = requireDevelopment();
  if (!devCheck.success) {
    return createErrorResponse(devCheck.error || 'Not found', 404);
  }

  // Apply security validation with strict rate limiting for debug endpoints
  const validation = await validateRequest(request, {
    rateLimitType: 'debug', // 3 requests per minute
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    // Test direct session retrieval using auth.api
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    return createSecureResponse({
      success: true,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          // Don't expose sensitive fields
        },
        expiresAt: session.session.expiresAt
      } : null,
      message: session ? "Session found" : "No active session",
      timestamp: new Date().toISOString(),
      environment: 'development'
    })
  } catch (error) {
    console.error("[Debug] Session test error:", error)
    return createErrorResponse(
      'Session test failed',
      500,
      error
    )
  }
}