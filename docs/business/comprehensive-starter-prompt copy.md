# Afarsemon AI Agency Platform - Project Starter Prompt

I'm working with an advanced monorepo architecture for an AI agency platform focused on the Israeli market. The project name is "Afarsemon" (אפרסמון) and includes a complete tech stack with authentication, database integration, AI capabilities, and multi-app deployment infrastructure.

## Current Monorepo Architecture

This is a **Turborepo-based monorepo** using **pnpm workspaces** with the following structure:

### Apps (`/apps/`)
- **`@afarsemon/www`** - Main application (Next.js 15.4.6 with App Router)
  - Full-stack Next.js application with Turbopack support
  - RTL (Right-to-Left) support for Hebrew interface
  - Protected routes with authentication middleware
  - API routes with comprehensive security measures
  - Drizzle ORM with PostgreSQL integration

- **`demos`** - Demo applications directory (placeholder for future demos)
- **`manage`** - Management dashboard (placeholder for admin panel)

### Packages (`/packages/`)
- **`@afarsemon/env`** - Centralized environment configuration with Zod validation
- **`ai-integrations`** - AI service integrations package
- **`i18n`** - Internationalization support
- **`payments`** - Payment processing integrations
- **`supabase`** - Supabase client and utilities
- **`ui`** - Shared UI components library
- **`vapi`** - Voice API integrations

## Technology Stack

### Core Framework
- **Next.js 15.4.6** with App Router
- **TypeScript 5** for type safety
- **Turborepo** for monorepo management
- **pnpm 10.13.1** as package manager
- **Node.js 18+** runtime requirement

### Authentication & Security
- **Better Auth** with comprehensive configuration
  - Google OAuth integration
  - Email/Password authentication
  - Session management with 7-day expiry
  - CSRF protection enabled
  - Secure cookie configuration for production
  - IP tracking for security
  - Password reset flow (ready for email service)
  - Email verification system (ready for email service)

### Database & ORM
- **PostgreSQL** as primary database (via Supabase)
- **Drizzle ORM** for type-safe database operations
- **Drizzle Kit** for migrations and schema management
- Optimized connection pooling for serverless environment
- SSL enabled for production connections

### AI Integration
- **Vercel AI SDK** with streaming support
- **Google Gemini** (gemini-2.5-flash model)
- **OpenAI** integration ready (GPT-4 default)
- Chat API with comprehensive security
- Rate limiting and request validation

### UI & Styling
- **Tailwind CSS v4** with PostCSS
- **shadcn/ui** component library
- **Lucide React** icons
- **Theme system** with dark mode support
- **Sonner** for toast notifications
- **React Hook Form** with Zod validation
- **Radix UI** primitives

### Security Infrastructure
- **Rate limiting** via Upstash Redis
  - General: 100 requests/minute
  - Auth: 10 requests/minute
  - Chat: 20 requests/minute
- **CSRF protection** on all state-changing operations
- **Request validation** with payload size limits
- **Secure headers** and cookie configuration
- **Environment variable validation** with Zod

### Deployment & DevOps
- **Vercel** deployment configured
- **Edge Runtime** support for API routes (Node.js 20.x)
- **Turbo** build caching
- Separate build commands for development and production
- Database migration on build

### Integration Capabilities
- **N8n webhook** integration ready
- **Make.com** webhook support
- **Zapier** webhook support
- **Cal.com** booking integration
- **Resend** email service (ready for configuration)

## Environment Configuration

The project uses a centralized environment configuration through `@afarsemon/env` package with the following variables:

### Required Variables
- `POSTGRES_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- `BETTER_AUTH_SECRET` - 32+ character secret for auth
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Optional Variables
- Application URLs (APP, WWW, DASHBOARD)
- AI service keys (OpenAI, Gemini)
- Analytics (Google Analytics, Facebook Pixel)
- Email service (Resend API)
- Webhook secrets for automation platforms

## Current Routes & Features

### Public Routes
- `/` - Home page (currently setup instructions)
- `/api/health` - Health check endpoint
- `/api/diagnostics` - System diagnostics

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- `/chat` - AI chat interface (requires authentication)

### API Routes
- `/api/auth/[...all]` - Better Auth endpoints
- `/api/chat` - AI chat endpoint with security
- `/api/n8n/webhook` - N8n automation webhook
- `/api/n8n/workflows` - N8n workflow management
- `/api/webhooks/[platform]` - Platform-specific webhooks

## Build & Development Scripts

### Root Level Commands
```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build all apps
pnpm lint         # Run linting across monorepo
pnpm typecheck    # Type checking across all packages
pnpm clean        # Clean build artifacts
pnpm format       # Format code with Prettier
```

### Database Commands
```bash
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Apply migrations
pnpm db:push      # Push schema to database
```

## Security Features Implemented

1. **Multi-layer Rate Limiting** - Redis-based with different limits per endpoint
2. **CSRF Protection** - Token validation on state-changing operations
3. **Request Validation** - Schema validation and payload size limits
4. **Secure Authentication** - Better Auth with production-ready configuration
5. **Environment Validation** - Runtime validation of all environment variables
6. **Security Headers** - Proper CORS, CSP, and security headers
7. **Session Management** - Secure cookies with proper SameSite configuration

## Hebrew/RTL Support

The application is configured for the Israeli market with:
- RTL layout support (`dir="rtl"`)
- Hebrew language setting (`lang="he"`)
- Hebrew metadata and descriptions
- Font support for Hebrew characters

## Important Context

This is a **production-ready boilerplate** with comprehensive security, authentication, and infrastructure already set up. All core systems are configured and tested for production deployment.

### CRITICAL: Preserve All Existing Infrastructure

**DO NOT remove or modify any of the following:**
- Authentication system (Better Auth configuration)
- Database setup and connections
- Environment configuration system
- Security middleware and validations
- Monorepo structure and build configuration
- Package dependencies
- Deployment configuration

## Project File Structure

```
afarsemon/
├── apps/
│   ├── www/                    # Main Next.js application
│   │   ├── src/
│   │   │   ├── app/            # App Router pages and API routes
│   │   │   ├── components/     # React components
│   │   │   ├── lib/           # Utility functions and configurations
│   │   │   └── middleware.ts   # Authentication middleware
│   │   └── package.json
│   ├── demos/                  # Demo applications
│   └── manage/                 # Management dashboard
├── packages/
│   ├── @afarsemon/env/        # Environment configuration
│   ├── ai-integrations/       # AI service integrations
│   ├── i18n/                  # Internationalization
│   ├── payments/              # Payment processing
│   ├── supabase/              # Supabase utilities
│   ├── ui/                    # Shared UI components
│   └── vapi/                  # Voice API integrations
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── package.json                # Root package.json
```

## Database Schema

The application uses Drizzle ORM with the following core tables:
- **users** - User authentication and profile data
- **sessions** - Active user sessions
- **accounts** - OAuth provider accounts
- **verification** - Email verification tokens
- Additional tables can be added via Drizzle schema

## What I Want to Build

Build me a dashboard in hebrew. 
As inspiration use https://github.com/supabase/supabase

להלן מבנה הסגמנטים הראשיים עבור לוח המחוונים של אפליקציית האינטרנט שלך, כפי שנדלה מהמקורות ומתאים לעסקים ישראליים קטנים ובינוניים (SMBs), מוצג בעברית בלבד:

### **פלטפורמת AI ואוטומציה**

*   **שירותי AI במיקור חוץ**: מחלקת בינה מלאכותית כשירות, מחלקת אוטומציה כשירות, צוות AI במיקור חוץ, עובדי AI, סוכני AI אוטונומיים.
*   **כלי אוטומציה ללא קוד / עם קוד נמוך**: אוטומציה רובוטית לתהליכים (RPA), תזמור תהליכים (Workflow Orchestration), אינטגרציה ל-Zapier ו-Make, אוטומציות Make.com, אוטומציות n8n.
*   **פיתוח יישומי רשת (WebApp)**: פיתוח webapp, webapp לעסקים בישראל, אפליקציית webapp בעברית.

### **שירות לקוחות**

*   **תמיכת לקוחות מבוססת AI**: AI לשירות לקוחות, צ׳אטבוט שירות לקוחות, בוט תמיכה 24/7, מענה ללקוחות 24/7, שירות לקוחות אוטומטי, אוטומציה לקול סנטר.
*   **ניהול פניות וכרטיסים**: תיעדוף פניות אוטומטי, מענה ראשון אוטומטי לטיקטים, ניתוב פניות חכם, ניטור SLA, ניהול SLA ומדדי ביצוע (KPIs).
*   **עיבוד שיחות ותקשורת**: תמלול שיחות לעברית, סיכומי שיחות אוטומטיים, אוטומציה לתמיכה רב-לשונית.

### **מכירות ושיווק**

*   **אוטומציית מכירות**: סוכן מכירות מבוסס AI, יצירת לידים אוטומטית, איתור לידים ב-LinkedIn אוטומטי, בוט לקביעת פגישות, הכנת פגישות מכירה אוטומטית, הצעות מחיר אוטומטיות, סיווג לידים אוטומטי, שיפור המרות באתר עם AI.
*   **אוטומציית שיווק**: אוטומציה לשיווק במייל, פרסונליזציה באתר, אופטימיזציית קמפיינים אוטומטית.
*   **ניטור תחרות ותמחור**: ניטור מחירים אוטומטי, תמחור דינמי מבוסס AI, ניטור מחירים ומתחרים.
*   **חיזוי וביקושים**: חיזוי ביקושים.

### **תפעול וניהול**

*   **אופטימיזציית תהליכים**: ייעול תהליכים עסקיים, תכנון משמרות חכם, אוטומציה לניהול משימות, בקרת תהליכים חכמה, התראות חריגות בזמן אמת.
*   **ניהול מלאי ורכש**: התראות מלאי חכמות, ניהול מלאי חכם, AI לניהול מלאי ורכש, התראות סיכון ספקים.
*   **לוגיסטיקה ומשלוחים**: מעקב משלוחים חכם, אוטומציה לתיאום לוגיסטי.
*   **בקרת איכות (QA)**: בדיקות איכות אוטומטיות (QA), בקרת איכות אוטומטית, בדיקות QA אוטומטיות.

### **פיננסים וחשבונאות**

*   **אוטומציה פיננסית**: התאמות חשבונאיות אוטומטיות, אוטומציה למימון וגבייה, אוטומציה לגבייה ותשלומים, אוטומציה לסליקת אשראי, בנקאות פתוחה אוטומציה לעסקים.
*   **דיווח ותאימות מס**: דיווח מע״מ אוטומטי, אוטומציה לדוחות מע״מ.
*   **זיהוי חשבוניות ועיבוד**: זיהוי חשבוניות (OCR), OCR חשבוניות בעברית, OCR חשבוניות מס, זיהוי הונאה ותשלומים חריגים, זיהוי הונאה בתשלומים.
*   **ניהול אשראי**: AI להערכת אשראי לקוחות.

### **מודיעין עסקי וניתוח נתונים**

*   **לוחות מחוונים בזמן אמת**: לוחות מחוונים בזמן אמת (BI), דשבורדים בזמן אמת, הפקת דוחות אוטומטית.
*   **ניתוח נתונים מתקדם**: ניקוי נתונים (Data Cleansing), מודיעין עסקי רב-לשוני, קבלת החלטות מבוססת נתונים, אנליטיקה תחזיתית לעסקים בישראל, AI לניתוח נתוני CRM, AI לניתוח נתוני ERP.

### **יצירת תוכן ועיבוד שפה**

*   **עיבוד מסמכים**: עיבוד מסמכים בעברית, Hebrew PDF extraction automation, AI לעיבוד חוזים ומסמכים משפטיים.
*   **ניתוח שפה טבעית (NLP)**: עיבוד שפה טבעית עברית (Hebrew NLP), ניתוח טקסט בעברית NLP, בוט שמבין עברית, זיהוי דיבור עברי, סיכומי מדיניות בעברית, חיזוי עזיבת לקוחות, Sentiment analysis Hebrew reviews.
*   **ניהול ידע**: הקמת מאגר ידע ארגוני, RAG בעברית (חיפוש מונחה ידע), מחסן ידע ארגוני ב-AI, חיפוש מונחה ידע בעברית.
*   **זיהוי תמונה**: זיהוי תמונה בעברית לעסקים.

### **רגולציה ותאימות**

*   **ניטור רגולציה**: ניטור רגולציה, ניטור רגולציה ותקינה.
*   **תאימות ופרטיות**: תאימות GDPR וחוק הגנת הפרטיות, הגנת פרטיות ו-PII, אבטחת מידע ו-PII.
*   **סיווג וניתוח**: סיווג קודי HS ומכס, ניתוח חוזים ב-AI.
*   **ניטור מדיניות**: ניטור מדיניות מרקטפלייסים.

### **אינטגרציות**

*   **מערכות ניהול לקוחות ועסקים**: אינטגרציה ל-CRM, אינטגרציה ל-ERP, AI לניתוח נתוני CRM, AI לניתוח נתוני ERP.
*   **פלטפורמות תקשורת**: אוטומציה ל-WhatsApp עסקי, בוט וואטסאפ לעסק, חיבור וואטסאפ עסקי למערכת CRM, n8n WhatsApp Business, Make.com WhatsApp Business.
*   **פלטפורמות מסחר ותשלום**: אינטגרציית תשלומים Stripe, אינטגרציה ל-Stripe, n8n Stripe, Make.com Stripe, אוטומציה ל-Shopify, n8n Shopify, Make.com Shopify, אוטומציה ל-WooCommerce, n8n WooCommerce, Make.com WooCommerce, אינטגרציית תשלומים וחשבוניות.
*   **כלי אוטומציה כלליים**: אינטגרציה ל-Zapier ו-Make, אוטומציות Make.com, Make.com אינטגרציה, Make.com API Connections, n8n אינטגרציה לעסקים, אוטומציות n8n, n8n בישראל, תהליכי n8n ל-CRM, n8n ל-ERP, n8n ל-Google Sheets, n8n Webhooks, Make.com Webhooks, חיבורי API לעסקים בישראל.
*   **פלטפורמות ישראליות**: Monday.com automation integration, Wix API automation, iCount accounting integration, Bit payment automation, Israeli CRM integration, Tranzila payment gateway automation, Pelecard API integration, PayBox business automation.
*   **פלטפורמות בינלאומיות נפוצות**: Salesforce Israel implementation, HubSpot Hebrew interface, Microsoft Teams automation Israel.
*   **פיתוח ותשתית**: אינטגרציות Supabase ו-Vercel, webapp אינטגרציה ל-Stripe, webapp אינטגרציה ל-Supabase.

### **פתרונות ורטיקליים**

*   **מסחר אלקטרוני**: אוטומציה למסחר אלקטרוני, אוטומציה לחנות אינטרנטית, WhatsApp e-commerce integration Israel, customer service chatbot e-commerce, inventory management automation Israel, automated cart abandonment Hebrew.
*   **ייצוא וייבוא**: אוטומציה לייצוא וייבוא, מעקב מכרזים (Tender Radar), איתור מפיצים בינלאומי, איתור מפיצים אוטומטי.
*   **נדל"ן**: אוטומציה לסוכני נדלן, ניהול נכסים אוטומטי, real estate CRM WhatsApp automation Israel.
*   **בריאות ורפואה**: אוטומציה לקליניקות, תזכורות תורים אוטומטיות, patient communication automation WhatsApp, medical practice management automation.
*   **שירותים משפטיים**: אוטומציה למשרד עורכי דין, legal document automation Hebrew, client intake automation Israel, contract management automation Hebrew.

[INSERT YOUR SPECIFIC PROJECT REQUIREMENTS HERE]

## Request

Please help me implement the features described above while **maintaining all existing infrastructure**. The implementation should:

1. **Preserve all current configurations** - Keep authentication, database, security, and build systems intact
2. **Utilize existing packages** - Leverage the monorepo structure and shared packages
3. **Follow established patterns** - Use the existing security middleware, validation, and error handling
4. **Maintain Hebrew/RTL support** - Ensure the interface remains compatible with Hebrew content
5. **Use shadcn/ui components** - Prioritize existing and installable shadcn components
6. **Respect the monorepo architecture** - Place code in appropriate packages/apps

## Success Criteria

The implementation should:
- Work seamlessly with the existing authentication system
- Utilize the current database schema (extend as needed)
- Maintain all security measures
- Follow the established code patterns
- Support both development and production environments
- Be fully compatible with the Vercel deployment setup

## Technical Constraints

1. **Must use existing dependencies** - Do not add new packages unless absolutely necessary
2. **Must follow monorepo structure** - Code organization must respect workspace boundaries
3. **Must maintain type safety** - All code must be TypeScript with proper types
4. **Must pass validation** - Environment variables, security checks, and linting must pass
5. **Must support serverless** - Code must work in Vercel's serverless environment

## Testing & Validation

Before considering the implementation complete:
1. Run `pnpm lint` - All linting must pass
2. Run `pnpm typecheck` - No TypeScript errors
3. Test authentication flow - Login/logout must work
4. Test in development - `pnpm dev` must run without errors
5. Build for production - `pnpm build` must succeed
6. Verify security - Rate limiting and CSRF protection must be active

## Additional Notes

- The project uses Turbopack for fast development builds
- Database migrations run automatically on production builds
- All API routes include comprehensive security validation
- The authentication system supports both OAuth and email/password
- Rate limiting is enforced via Redis (Upstash)
- The project is optimized for Vercel deployment with edge runtime support
- Hebrew content and RTL layout must be considered in all UI implementations
- All environment variables are validated at runtime using Zod schemas

## Current Claude Instructions (CLAUDE.md)

The project includes specific instructions for AI assistants:
- Always run LINT and TYPECHECK scripts after completing changes
- Start the dev server after completing changes (use `npx kill` to free port 3000)
- Avoid custom colors - stick to standard Tailwind and shadcn tokens
- Always test code when implementing features
- Use agents for specialized tasks
- Use context7 MCP server for documentation
- Use playwright MCP server for UI testing
- Choose appropriate MCP servers for relevant tasks

## How to Use This Prompt

1. **Copy this entire prompt** to start a new conversation with an AI assistant
2. **Fill in the "What I Want to Build" section** with your specific requirements
3. **Ensure the assistant understands** to preserve all existing infrastructure
4. **Reference this document** whenever starting new development work
5. **Update this document** when major infrastructure changes are made

---

*This starter prompt is designed to ensure consistent, safe, and efficient development while preserving the existing infrastructure of the Afarsemon platform.*