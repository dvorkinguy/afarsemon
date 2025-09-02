// TypeScript environment variable declarations
// This provides autocomplete and type checking for process.env

declare namespace NodeJS {
  interface ProcessEnv {
    // Application URLs
    readonly NEXT_PUBLIC_APP_URL?: string;
    readonly NEXT_PUBLIC_WWW_URL?: string;
    readonly NEXT_PUBLIC_DASHBOARD_URL?: string;

    // Database
    readonly POSTGRES_URL: string;
    readonly DATABASE_URL?: string;

    // Supabase
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;

    // Better Auth
    readonly BETTER_AUTH_SECRET: string;
    readonly BETTER_AUTH_URL?: string;
    readonly NEXT_PUBLIC_BETTER_AUTH_URL?: string;

    // Google OAuth
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;

    // AI Services
    readonly OPENAI_API_KEY?: string;
    readonly OPENAI_MODEL?: string;
    readonly GOOGLE_GENERATIVE_AI_API_KEY?: string;
    readonly GEMINI_API_KEY?: string;
    readonly GEMINI_MODEL?: string;

    // Analytics (Optional)
    readonly GOOGLE_ANALYTICS_ID?: string;
    readonly FACEBOOK_PIXEL_ID?: string;

    // Email (Optional)
    readonly RESEND_API_KEY?: string;

    // Webhook Secrets (Optional)
    readonly WEBHOOK_SECRET_N8N?: string;
    readonly WEBHOOK_SECRET_MAKE?: string;
    readonly WEBHOOK_SECRET_ZAPIER?: string;

    // Node Environment
    readonly NODE_ENV: "development" | "production" | "test";
  }
}