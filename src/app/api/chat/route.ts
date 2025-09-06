import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { rateLimiters, getClientIdentifier, checkRateLimit } from "@/lib/rate-limit";
import { safeParseJSON, sanitizeErrorMessage } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    // SECURITY FIX: Add authentication check
    const session = await requireAuth(req);
    
    // Rate limiting (more restrictive for AI endpoints)
    const clientId = session.user.id || getClientIdentifier(req);
    const rateLimitResult = await checkRateLimit(rateLimiters.chat, clientId);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.reset || 0).toISOString(),
          }
        }
      );
    }
    
    // Parse and validate request body
    const body = await safeParseJSON(req);
    const { messages }: { messages: UIMessage[] } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format. Messages array is required.' },
        { status: 400 }
      );
    }

    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
    });

    return (
      result as unknown as { toUIMessageStreamResponse: () => Response }
    ).toUIMessageStreamResponse();
  } catch (error) {
    // Improved error handling
    const errorMessage = sanitizeErrorMessage(error, isDevelopment);
    
    if (isDevelopment) {
      console.error('Chat API error:', error);
    }
    
    // Determine appropriate status code
    let statusCode = 500;
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        statusCode = 401;
      } else if (error.message.includes('Invalid') || error.message.includes('Payload too large')) {
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
