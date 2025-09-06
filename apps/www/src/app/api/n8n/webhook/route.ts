import { NextRequest } from 'next/server';
import { n8n } from '@/lib/n8n';
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse,
  webhookPathSchema,
  jsonPayloadSchema,
  MAX_PAYLOAD_SIZES
} from '@/lib/security';

export async function POST(request: NextRequest) {
  // Comprehensive request validation with security measures
  const validation = await validateRequest(request, {
    requireAuth: true, // Require authentication for webhook access
    rateLimitType: 'webhook', // 10 requests per minute
    maxPayloadSize: MAX_PAYLOAD_SIZES.JSON, // 1MB limit
    allowedMethods: ['POST'],
    validateCSRF: true, // CSRF protection
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    const url = new URL(request.url);
    const webhookPath = url.searchParams.get('path');
    
    if (!webhookPath) {
      return createErrorResponse('Webhook path is required', 400);
    }

    // Validate webhook path - only alphanumeric, hyphens, and underscores
    const pathValidation = webhookPathSchema.safeParse(webhookPath);
    if (!pathValidation.success) {
      return createErrorResponse(
        'Invalid webhook path. Only alphanumeric characters, hyphens, and underscores are allowed',
        400
      );
    }

    // Validate payload size and structure
    const payloadValidation = jsonPayloadSchema.safeParse(validation.data);
    if (!payloadValidation.success) {
      return createErrorResponse(
        'Invalid or oversized payload',
        400
      );
    }

    const data = payloadValidation.data;
    const isTest = url.searchParams.get('test') === 'true';
    
    // Additional security: Log webhook activity for monitoring
    console.log('[Security] Webhook triggered:', {
      path: webhookPath,
      user: validation.user?.email || 'unknown',
      isTest,
      payloadSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    
    const result = await n8n.triggerWebhook(webhookPath, data, isTest);
    
    return createSecureResponse({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Log error for debugging but don't expose details
    console.error('[Security] Webhook error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Failed to trigger webhook',
      500,
      error
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(_request: NextRequest) {
  return createSecureResponse(null, 200, {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  });
}