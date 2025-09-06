import { NextRequest } from "next/server";
import { 
  requireDevelopment,
  createSecureResponse, 
  createErrorResponse
} from '@/lib/security';
import { clearRateLimitCache } from '@/lib/rate-limit';

/**
 * Development only endpoint to clear rate limit cache
 * POST /api/dev/clear-rate-limits
 * 
 * SECURITY: Development only
 */
export async function POST(_request: NextRequest) {
  // Check if we're in development
  const devCheck = requireDevelopment();
  if (!devCheck.success) {
    return createErrorResponse(devCheck.error || 'Not available', 404);
  }

  try {
    clearRateLimitCache();
    
    return createSecureResponse({
      success: true,
      message: 'Rate limit cache cleared',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createErrorResponse(
      'Failed to clear rate limit cache',
      500,
      error
    );
  }
}