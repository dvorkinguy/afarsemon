import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { rateLimiters, getClientIP, createRateLimitResponse } from '@/lib/rate-limit';

// Maximum payload sizes for different content types
export const MAX_PAYLOAD_SIZES = {
  JSON: 1024 * 1024, // 1MB for JSON payloads
  TEXT: 100 * 1024,  // 100KB for text
  FORM: 10 * 1024,   // 10KB for form data
} as const;

// Security headers configuration
export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https: wss:;
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim(),
  
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // Remove server information
  'Server': 'Next.js',
  
  // Prevent referrer leakage
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;

// Validation schemas
export const webhookPathSchema = z.string().regex(
  /^[a-zA-Z0-9-_]+$/,
  'Webhook path must contain only alphanumeric characters, hyphens, and underscores'
);

export const jsonPayloadSchema = z.object({}).passthrough().refine(
  (data) => JSON.stringify(data).length <= MAX_PAYLOAD_SIZES.JSON,
  { message: `Payload size must not exceed ${MAX_PAYLOAD_SIZES.JSON} bytes` }
);

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: urls
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .trim();
}

export function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeString(key)] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

// Type definitions for user objects
export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
};

// Helper to safely cast user object
export function castUser(user: unknown): User {
  return user as User;
}

// Authentication helpers
export async function requireAuth(_request?: Request): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    
    if (!session?.user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }
    
    return {
      success: true,
      user: session.user,
    };
  } catch (_error) {
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

// Admin authentication helper
export async function requireAdmin(_request?: Request): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  const authResult = await requireAuth(_request);
  
  if (!authResult.success) {
    return authResult;
  }
  
  // Check if user has admin role (you may need to adjust this based on your user schema)
  const user = authResult.user as User;
  const isAdmin = user?.role === 'admin' || user?.email === process.env.ADMIN_EMAIL;
  
  if (!isAdmin) {
    return {
      success: false,
      error: 'Admin access required',
    };
  }
  
  return authResult;
}

// Development-only access helper
export function requireDevelopment(): { success: boolean; error?: string } {
  if (process.env.NODE_ENV !== 'development') {
    return {
      success: false,
      error: 'This endpoint is only available in development environment',
    };
  }
  
  return { success: true };
}

// CSRF protection
export function validateCSRF(request: Request): { success: boolean; error?: string } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  // Allow same-origin requests
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost === host) {
      return { success: true };
    }
  }
  
  // Allow referer-based validation
  if (referer) {
    const refererHost = new URL(referer).host;
    if (refererHost === host) {
      return { success: true };
    }
  }
  
  // In development, allow localhost requests
  if (process.env.NODE_ENV === 'development' && host?.includes('localhost')) {
    return { success: true };
  }
  
  // Check for CSRF token header (you can implement token-based CSRF later)
  const csrfToken = request.headers.get('x-csrf-token');
  if (csrfToken === 'development' && process.env.NODE_ENV === 'development') {
    return { success: true };
  }
  
  return {
    success: false,
    error: 'CSRF validation failed',
  };
}

// Payload size validation
export async function validatePayloadSize(
  request: Request,
  maxSize: number = MAX_PAYLOAD_SIZES.JSON
): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    const contentLength = request.headers.get('content-length');
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return {
        success: false,
        error: `Payload too large. Maximum size is ${maxSize} bytes`,
      };
    }
    
    const text = await request.text();
    
    if (text.length > maxSize) {
      return {
        success: false,
        error: `Payload too large. Maximum size is ${maxSize} bytes`,
      };
    }
    
    // Try to parse as JSON if content-type suggests it
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        const sanitizedData = sanitizeObject(data);
        return { success: true, data: sanitizedData };
      } catch (_error) {
        return {
          success: false,
          error: 'Invalid JSON payload',
        };
      }
    }
    
    return { success: true, data: sanitizeString(text) };
  } catch (_error) {
    return {
      success: false,
      error: 'Failed to read request payload',
    };
  }
}

// Apply rate limiting
export async function applyRateLimit(
  request: Request,
  limiterType: keyof typeof rateLimiters
): Promise<{ success: boolean; response?: NextResponse }> {
  try {
    const clientIP = getClientIP(request);
    const identifier = `${clientIP}:${limiterType}`;
    
    const limiter = rateLimiters[limiterType];
    const result = await limiter.limit(identifier);
    
    const rateLimitResponse = createRateLimitResponse(
      result.success,
      result.limit,
      result.remaining,
      new Date(result.reset)
    );
    
    if (!rateLimitResponse.success) {
      return {
        success: false,
        response: NextResponse.json(
          { error: rateLimitResponse.error },
          { 
            status: rateLimitResponse.status,
            headers: rateLimitResponse.headers as Record<string, string>,
          }
        ),
      };
    }
    
    return { success: true };
  } catch (error) {
    // Log the error but don't block the request in development
    console.warn('Rate limiting failed:', error);
    
    // In development, allow the request to proceed with a warning
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Rate Limit] Fallback: Allowing request due to rate limiting error in development`
      );
      return { success: true };
    }
    
    // In production, you might want to either:
    // 1. Allow the request (fail open)
    // 2. Block the request (fail closed)
    // For now, we'll fail open to avoid service disruption
    console.error('Rate limiting system failed, allowing request to proceed');
    return { success: true };
  }
}

// Create secure response with security headers
export function createSecureResponse(
  data: unknown,
  status: number = 200,
  additionalHeaders: Record<string, string> = {}
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...additionalHeaders,
    },
  });
}

// Error response without information leakage
export function createErrorResponse(
  message: string,
  status: number = 500,
  logError?: unknown
): NextResponse {
  // Log the actual error for debugging but don't expose it
  if (logError) {
    console.error('API Error:', logError);
  }
  
  // Generic error messages for production
  const productionSafeMessage = process.env.NODE_ENV === 'production' 
    ? (status === 404 ? 'Not found' : status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Internal server error')
    : message;
  
  return createSecureResponse(
    { error: productionSafeMessage },
    status
  );
}

// Comprehensive request validation
export async function validateRequest(
  request: Request,
  options: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
    rateLimitType?: keyof typeof rateLimiters;
    maxPayloadSize?: number;
    allowedMethods?: string[];
    validateCSRF?: boolean;
  } = {}
): Promise<{
  success: boolean;
  response?: NextResponse;
  data?: unknown;
  user?: User;
}> {
  // Method validation
  if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
    return {
      success: false,
      response: createErrorResponse('Method not allowed', 405),
    };
  }
  
  // Rate limiting
  if (options.rateLimitType) {
    const rateLimitResult = await applyRateLimit(request, options.rateLimitType);
    if (!rateLimitResult.success) {
      return {
        success: false,
        response: rateLimitResult.response,
      };
    }
  }
  
  // CSRF validation for non-GET requests
  if (options.validateCSRF && request.method !== 'GET') {
    const csrfResult = validateCSRF(request);
    if (!csrfResult.success) {
      return {
        success: false,
        response: createErrorResponse(csrfResult.error || 'CSRF validation failed', 403),
      };
    }
  }
  
  // Authentication
  let user;
  if (options.requireAdmin) {
    const adminResult = await requireAdmin(request);
    if (!adminResult.success) {
      return {
        success: false,
        response: createErrorResponse(adminResult.error || 'Admin access required', 403),
      };
    }
    user = adminResult.user;
  } else if (options.requireAuth) {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return {
        success: false,
        response: createErrorResponse(authResult.error || 'Authentication required', 401),
      };
    }
    user = authResult.user;
  }
  
  // Payload validation for non-GET requests
  let data;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const payloadResult = await validatePayloadSize(
      request.clone(), // Clone to avoid consuming the stream
      options.maxPayloadSize
    );
    if (!payloadResult.success) {
      return {
        success: false,
        response: createErrorResponse(payloadResult.error || 'Invalid payload', 400),
      };
    }
    data = payloadResult.data;
  }
  
  return {
    success: true,
    data,
    user,
  };
}