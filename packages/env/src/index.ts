import { z } from "zod";

// Base environment schema with all possible variables
const baseEnvSchema = z.object({
  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_WWW_URL: z.string().url().optional(),
  NEXT_PUBLIC_DASHBOARD_URL: z.string().url().optional(),

  // Database
  POSTGRES_URL: z.string().min(1, "Database URL is required"),
  DATABASE_URL: z.string().min(1).optional(), // Fallback for some tools

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32, "Better Auth secret must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required for authentication"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required for authentication"),

  // AI Services
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default("gpt-4").optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash").optional(),

  // Analytics (Optional)
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  FACEBOOK_PIXEL_ID: z.string().optional(),

  // Email (Optional)
  RESEND_API_KEY: z.string().optional(),

  // Webhook Secrets (Optional)
  WEBHOOK_SECRET_N8N: z.string().optional(),
  WEBHOOK_SECRET_MAKE: z.string().optional(),
  WEBHOOK_SECRET_ZAPIER: z.string().optional(),
});

// Server-side environment (has access to all variables)
const serverEnvSchema = baseEnvSchema;

// Client-side environment (only NEXT_PUBLIC_ variables)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: baseEnvSchema.shape.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_WWW_URL: baseEnvSchema.shape.NEXT_PUBLIC_WWW_URL,
  NEXT_PUBLIC_DASHBOARD_URL: baseEnvSchema.shape.NEXT_PUBLIC_DASHBOARD_URL,
  NEXT_PUBLIC_SUPABASE_URL: baseEnvSchema.shape.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: baseEnvSchema.shape.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: baseEnvSchema.shape.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  NEXT_PUBLIC_BETTER_AUTH_URL: baseEnvSchema.shape.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Environment validation functions
function validateServerEnv(): z.infer<typeof serverEnvSchema> {
  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('\n');
      
      throw new Error(
        `Environment validation failed:\n${issues}\n\n` +
        `Please check your .env.local file in the root directory.`
      );
    }
    throw error;
  }
}

function validateClientEnv(): z.infer<typeof clientEnvSchema> {
  const clientEnvVars = Object.keys(clientEnvSchema.shape).reduce((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, {} as Record<string, string | undefined>);

  try {
    return clientEnvSchema.parse(clientEnvVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('\n');
      
      throw new Error(
        `Client environment validation failed:\n${issues}\n\n` +
        `Please check your NEXT_PUBLIC_ variables in .env.local`
      );
    }
    throw error;
  }
}

// Create validated environment objects (lazy-loaded to avoid import-time errors)
let serverEnv: z.infer<typeof serverEnvSchema> | undefined;
let clientEnv: z.infer<typeof clientEnvSchema> | undefined;

// Export types
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Export validated environment objects with safe access
export const getServerEnv = (): z.infer<typeof serverEnvSchema> => {
  if (typeof window !== 'undefined') {
    throw new Error('Server environment is not available on client side');
  }
  if (!serverEnv) {
    // Lazy initialization on first access
    try {
      serverEnv = validateServerEnv();
    } catch (error) {
      console.error('❌ Server environment validation failed:', error);
      throw error;
    }
  }
  return serverEnv;
};

export const getClientEnv = (): z.infer<typeof clientEnvSchema> => {
  if (!clientEnv) {
    // Lazy initialization on first access
    try {
      if (typeof window === 'undefined') {
        // Server-side: create client env from server env
        const clientEnvVars = Object.keys(clientEnvSchema.shape).reduce((acc, key) => {
          acc[key] = process.env[key];
          return acc;
        }, {} as Record<string, string | undefined>);
        clientEnv = clientEnvSchema.parse(clientEnvVars);
      } else {
        // Client-side: validate client env
        clientEnv = validateClientEnv();
      }
    } catch (error) {
      console.error('❌ Client environment validation failed:', error);
      throw error;
    }
  }
  return clientEnv;
};

// For backwards compatibility and direct access
export { serverEnv, clientEnv };

// Export validation functions for manual use
export { validateServerEnv, validateClientEnv };

// Export schemas for extending
export { serverEnvSchema, clientEnvSchema, baseEnvSchema };