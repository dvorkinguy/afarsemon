import { z } from "zod";

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid({
  message: "Invalid UUID format",
});

/**
 * Webhook platform validation schema
 */
export const webhookPlatformSchema = z.enum(["n8n", "make", "zapier", "custom"], {
  errorMap: () => ({ message: "Invalid platform. Must be one of: n8n, make, zapier, custom" }),
});

/**
 * Request body size validation (1MB limit)
 */
export const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1MB in bytes

/**
 * Validate request payload size
 */
export async function validatePayloadSize(request: Request): Promise<void> {
  const contentLength = request.headers.get("content-length");
  
  if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
    throw new Error(`Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE} bytes (1MB)`);
  }
}

/**
 * Safe JSON parsing with error handling
 */
export async function safeParseJSON(request: Request): Promise<any> {
  try {
    // Validate payload size first
    await validatePayloadSize(request);
    
    const text = await request.text();
    
    // Check if body is empty
    if (!text) {
      throw new Error("Empty request body");
    }
    
    // Check text length as additional safety
    if (text.length > MAX_PAYLOAD_SIZE) {
      throw new Error(`Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE} bytes (1MB)`);
    }
    
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format");
    }
    throw error;
  }
}

/**
 * Sanitize error messages for production
 */
export function sanitizeErrorMessage(error: unknown, isDevelopment: boolean = false): string {
  if (isDevelopment) {
    // In development, return detailed error messages
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
  
  // In production, return generic messages for security
  if (error instanceof Error) {
    // Some errors are safe to expose
    if (error.message.includes("Unauthorized") || 
        error.message.includes("Forbidden") ||
        error.message.includes("Not found") ||
        error.message.includes("Invalid") ||
        error.message.includes("Payload too large") ||
        error.message.includes("Rate limit exceeded")) {
      return error.message;
    }
  }
  
  // Generic error message for production
  return "An error occurred processing your request";
}