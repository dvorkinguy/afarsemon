import { NextRequest } from 'next/server';
import { n8n } from '@/lib/n8n';
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse,
  jsonPayloadSchema,
  MAX_PAYLOAD_SIZES
} from '@/lib/security';

export async function GET(request: NextRequest) {
  // Apply security validation for workflow listing
  const validation = await validateRequest(request, {
    requireAuth: true, // Require authentication for workflow access
    rateLimitType: 'general', // 50 requests per minute
    allowedMethods: ['GET'],
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    // Security: Log workflow access for monitoring
    console.log('[Security] Workflows list requested:', {
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    const workflows = await n8n.getWorkflows();
    
    return createSecureResponse({
      success: true,
      workflows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Log error for debugging but don't expose details
    console.error('[Security] Workflows fetch error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Failed to fetch workflows',
      500,
      error
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply comprehensive security validation for workflow execution
  const validation = await validateRequest(request, {
    requireAuth: true, // Require authentication for workflow execution
    rateLimitType: 'general', // 50 requests per minute
    maxPayloadSize: MAX_PAYLOAD_SIZES.JSON, // 1MB limit
    allowedMethods: ['POST'],
    validateCSRF: true, // CSRF protection
  });

  if (!validation.success) {
    return validation.response!;
  }

  try {
    const body = validation.data as { workflowId?: string; data?: unknown };
    
    if (!body || typeof body !== 'object') {
      return createErrorResponse('Invalid request body', 400);
    }

    const { workflowId, data } = body;
    
    if (!workflowId) {
      return createErrorResponse('Workflow ID is required', 400);
    }

    // Validate workflowId format (should be alphanumeric/UUID)
    if (typeof workflowId !== 'string' || !/^[a-zA-Z0-9-_]+$/.test(workflowId)) {
      return createErrorResponse('Invalid workflow ID format', 400);
    }

    // Validate data payload if provided
    if (data !== undefined) {
      const dataValidation = jsonPayloadSchema.safeParse(data);
      if (!dataValidation.success) {
        return createErrorResponse('Invalid workflow data payload', 400);
      }
    }

    // Security: Log workflow execution for monitoring
    console.log('[Security] Workflow execution requested:', {
      user: validation.user?.email || 'unknown',
      workflowId,
      hasData: !!data,
      dataSize: data ? JSON.stringify(data).length : 0,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    const result = await n8n.executeWorkflow(workflowId, data as Record<string, unknown> | undefined);
    
    return createSecureResponse({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Log error for debugging but don't expose details
    console.error('[Security] Workflow execution error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Failed to execute workflow',
      500,
      error
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(_request: NextRequest) {
  return createSecureResponse(null, 200, {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  });
}