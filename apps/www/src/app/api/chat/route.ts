import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextRequest } from "next/server";
import { 
  validateRequest, 
  createSecureResponse, 
  createErrorResponse,
  MAX_PAYLOAD_SIZES
} from '@/lib/security';

export async function POST(request: NextRequest) {
  // Comprehensive request validation with security measures
  const validation = await validateRequest(request, {
    requireAuth: true, // Require authentication for chat
    rateLimitType: 'chat', // 20 requests per minute
    maxPayloadSize: MAX_PAYLOAD_SIZES.JSON, // 1MB limit
    allowedMethods: ['POST'],
    validateCSRF: true, // CSRF protection
  });

  if (!validation.success) {
    return validation.response!;
  }

  // Validate request body
  let messages: UIMessage[];
  try {
    const body = validation.data as { messages?: UIMessage[] };
    
    if (!body || typeof body !== 'object') {
      return createErrorResponse('Invalid request body', 400);
    }
    
    messages = body.messages || [];
    
    if (!Array.isArray(messages)) {
      return createErrorResponse('Invalid messages format - must be an array', 400);
    }
    
    // Validate message structure and content length
    for (const message of messages) {
      if (!message || typeof message !== 'object') {
        return createErrorResponse('Invalid message format', 400);
      }
      
      const content = (message as { content?: string }).content;
      if (!content || typeof content !== 'string') {
        return createErrorResponse('Message content is required and must be a string', 400);
      }
      
      // Limit individual message content length (10KB per message)
      if (content.length > 10 * 1024) {
        return createErrorResponse('Message content too long (max 10KB per message)', 400);
      }
    }
    
    // Limit total number of messages in conversation (prevent memory issues)
    if (messages.length > 50) {
      return createErrorResponse('Too many messages in conversation (max 50)', 400);
    }
    
  } catch (_error) {
    return createErrorResponse('Invalid request body format', 400);
  }

  try {
    // Security: Log chat usage for monitoring
    console.log('[Security] Chat API request:', {
      user: validation.user?.email || 'unknown',
      messageCount: messages.length,
      totalContentLength: messages.reduce((sum, msg) => sum + ((msg as { content?: string }).content?.length || 0), 0),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
    });

    return (
      result as unknown as { toUIMessageStreamResponse: () => Response }
    ).toUIMessageStreamResponse();
    
  } catch (error) {
    // Log error for debugging but don't expose details
    console.error('[Security] Chat API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: validation.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    return createErrorResponse(
      'Failed to process chat request',
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