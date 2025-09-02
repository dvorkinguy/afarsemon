# Environment Variables Architecture

## Single Source of Truth Implementation ✅

This monorepo now uses a **single source of truth** for all environment variables across all applications.

## Architecture Overview

```
/afarsemon/
├── .env.local              # ← SINGLE SOURCE OF TRUTH (all variables)
├── .env.example            # ← Template for developers
├── turbo.json              # ← Declares all global environment variables
├── packages/env/           # ← Shared validation package
│   ├── src/index.ts        # ← Zod validation schemas & exported env objects  
│   ├── src/env.d.ts        # ← TypeScript environment declarations
│   └── package.json
└── apps/
    ├── www/                # ← Inherits from root, uses @afarsemon/env
    ├── manage/             # ← Future app, will inherit from root
    └── demos/              # ← Future app, will inherit from root
```

## How It Works

### 1. **Root Environment File**
- **Location**: `/afarsemon/.env.local`
- **Contains**: All environment variables for all apps
- **Loaded by**: Turborepo's `globalEnv` configuration
- **Shared by**: All apps automatically via Turborepo

### 2. **Environment Validation Package** 
- **Package**: `@afarsemon/env`
- **Validation**: Uses Zod schemas for runtime validation
- **Type Safety**: Provides TypeScript definitions
- **Client/Server**: Separates client-side vs server-side variables

### 3. **Usage in Apps**
```typescript
// Server-side code (API routes, server components, middleware)
import { getServerEnv } from "@afarsemon/env";
const serverEnv = getServerEnv();
console.log(serverEnv.POSTGRES_URL);

// Client-side code (components, hooks) - Direct Next.js approach
// Environment variables automatically available from root .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Or use client env validation
import { getClientEnv } from "@afarsemon/env";  
const clientEnv = getClientEnv(); // Only in server-side rendering
```

## Environment Variables Included

### **Application URLs**
- `NEXT_PUBLIC_APP_URL` - Main app URL
- `NEXT_PUBLIC_WWW_URL` - Marketing site URL
- `NEXT_PUBLIC_DASHBOARD_URL` - Dashboard app URL

### **Database**
- `POSTGRES_URL` - PostgreSQL connection string (validated as required)

### **Supabase**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (validated as required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key (validated as required)
- `SUPABASE_SERVICE_ROLE_KEY` - Private service role key (validated as required)

### **Better Auth**
- `BETTER_AUTH_SECRET` - 32+ character secret (validated)
- `BETTER_AUTH_URL` - Auth service URL
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Client-side auth URL

### **Google OAuth**
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (validated as required)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (validated as required)

### **AI Services**
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `OPENAI_MODEL` - OpenAI model name (defaults to "gpt-4")
- `GOOGLE_GENERATIVE_AI_API_KEY` - Gemini API key (optional)
- `GEMINI_API_KEY` - Alias for Gemini API key (optional)
- `GEMINI_MODEL` - Gemini model name (defaults to "gemini-2.5-flash")

### **Optional Services**
- `GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID
- `FACEBOOK_PIXEL_ID` - Facebook Pixel ID
- `RESEND_API_KEY` - Resend email service API key
- `WEBHOOK_SECRET_N8N` - n8n webhook secret
- `WEBHOOK_SECRET_MAKE` - Make.com webhook secret
- `WEBHOOK_SECRET_ZAPIER` - Zapier webhook secret

## Benefits Achieved ✅

### **1. Single Source of Truth**
- ✅ One `.env.local` file contains ALL environment variables
- ✅ No duplication across apps
- ✅ Easy to maintain and update

### **2. Type Safety**
- ✅ Full TypeScript support with autocomplete
- ✅ Compile-time error checking
- ✅ IDE IntelliSense for all environment variables

### **3. Runtime Validation**
- ✅ Zod schemas validate environment variables at startup
- ✅ Clear error messages for missing/invalid variables
- ✅ Fail-fast approach prevents runtime issues

### **4. Security**
- ✅ Separates client-side vs server-side variables
- ✅ Validates required variables exist
- ✅ Enforces minimum lengths for secrets

### **5. Developer Experience**
- ✅ Clear documentation and examples
- ✅ Template file (`.env.example`) for new developers
- ✅ Turborepo automatically shares variables across apps

## Migration Status

- ✅ **Root `.env.local`** - Centralized all environment variables
- ✅ **Turborepo Config** - Updated `globalEnv` with all variables  
- ✅ **Shared Package** - Created `@afarsemon/env` with validation
- ✅ **TypeScript Definitions** - Added environment variable types
- ✅ **App Integration** - Updated `www` app to use validated environment
- ✅ **Testing** - Lint, typecheck, and dev server all working

## Next Steps for New Apps

When adding new apps (`manage`, `demos`), simply:

1. Add `@afarsemon/env` to dependencies
2. Import `serverEnv` or `clientEnv` as needed
3. Environment variables automatically inherited from root

## Troubleshooting

### Missing Environment Variables
The validation will show clear error messages:
```
Environment validation failed:
GOOGLE_CLIENT_ID: String must contain at least 1 character(s)
POSTGRES_URL: String must contain at least 1 character(s)

Please check your .env.local file in the root directory.
```

### Adding New Variables
1. Add to root `.env.local`
2. Add to `.env.example` template
3. Add to `turbo.json` globalEnv array
4. Add to Zod schema in `packages/env/src/index.ts`
5. Add to TypeScript definitions in `packages/env/src/env.d.ts`

This architecture provides a robust, maintainable, and type-safe environment variable system for the entire monorepo. 🚀