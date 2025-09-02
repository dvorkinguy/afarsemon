# Agentic Coding Boilerplate

A complete agentic coding boilerplate with authentication, PostgreSQL database, AI chat functionality, and modern UI components - perfect for building AI-powered applications and autonomous agents.

## 🚀 Features

- **🔐 Authentication**: Better Auth with Google OAuth integration
- **🗃️ Database**: Drizzle ORM with PostgreSQL
- **🤖 AI Integration**: Vercel AI SDK with OpenAI support
- **🎨 UI Components**: shadcn/ui with Tailwind CSS
- **⚡ Modern Stack**: Next.js 15, React 19, TypeScript
- **📱 Responsive**: Mobile-first design approach

## 🎥 Video Tutorial

Watch the complete walkthrough of this agentic coding template:

[![Agentic Coding Boilerplate Tutorial](https://img.youtube.com/vi/T0zFZsr_d0Q/maxresdefault.jpg)](https://youtu.be/T0zFZsr_d0Q)

<a href="https://youtu.be/T0zFZsr_d0Q" target="_blank" rel="noopener noreferrer">🔗 Watch on YouTube</a>

## ☕ Support This Project

If this boilerplate helped you build something awesome, consider buying me a coffee!

[![Buy me a coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/leonvanzyl)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Version 18.0 or higher (<a href="https://nodejs.org/" target="_blank">Download here</a>)
- **Git**: For cloning the repository (<a href="https://git-scm.com/" target="_blank">Download here</a>)
- **PostgreSQL**: Either locally installed or access to a hosted service like Vercel Postgres

## 🛠️ Quick Setup

### 1. Clone or Download the Repository

**Option A: Clone with Git**

```bash
git clone https://github.com/leonvanzyl/agentic-coding-starter-kit.git
cd agentic-coding-starter-kit
```

**Option B: Download ZIP**
Download the repository as a ZIP file and extract it to your desired location.

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp env.example .env
```

Fill in your environment variables in the `.env` file:

```env
# Database
POSTGRES_URL="postgresql://username:password@localhost:5432/your_database_name"

# Authentication - Better Auth
BETTER_AUTH_SECRET="your-random-32-character-secret-key-here"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration (Optional - for chat functionality)
OPENAI_API_KEY="sk-your-openai-api-key-here"
OPENAI_MODEL="gpt-5-mini"

# App URL (for production deployments)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

Generate and run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the Development Server

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

## ⚙️ Service Configuration

### PostgreSQL Database on Vercel

1. Go to <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a>
2. Navigate to the **Storage** tab
3. Click **Create** → **Postgres**
4. Choose your database name and region
5. Copy the `POSTGRES_URL` from the `.env.local` tab
6. Add it to your `.env` file

### Google OAuth Credentials

1. Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>
2. Create a new project or select an existing one
3. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Set application type to **Web application**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the **Client ID** and **Client Secret** to your `.env` file

### OpenAI API Key

1. Go to <a href="https://platform.openai.com/dashboard" target="_blank">OpenAI Platform</a>
2. Navigate to **API Keys** in the sidebar
3. Click **Create new secret key**
4. Give it a name and copy the key
5. Add it to your `.env` file as `OPENAI_API_KEY`

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── chat/          # AI chat endpoint
│   ├── chat/              # AI chat page
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   └── ui/               # shadcn/ui components
└── lib/                  # Utilities and configurations
    ├── auth.ts           # Better Auth configuration
    ├── auth-client.ts    # Client-side auth utilities
    ├── db.ts             # Database connection
    ├── schema.ts         # Database schema
    └── utils.ts          # General utilities
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database (drop all tables)
```

## 📖 Pages Overview

- **Home (`/`)**: Landing page with setup instructions and features overview
- **Dashboard (`/dashboard`)**: Protected user dashboard with profile information
- **Chat (`/chat`)**: AI-powered chat interface using OpenAI (requires authentication)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Deploy your application:

   ```bash
   vercel --prod
   ```

3. Follow the prompts to configure your deployment
4. Add your environment variables when prompted or via the Vercel dashboard

### Production Environment Variables

Ensure these are set in your production environment:

- `POSTGRES_URL` - Production PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secure random 32+ character string
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `OPENAI_MODEL` - OpenAI model name (optional, defaults to gpt-5-mini)
- `NEXT_PUBLIC_APP_URL` - Your production domain

## 🎥 Tutorial Video

Watch my comprehensive tutorial on how to use this agentic coding boilerplate to build AI-powered applications:

<a href="https://youtu.be/T0zFZsr_d0Q" target="_blank" rel="noopener noreferrer">📺 YouTube Tutorial - Building with Agentic Coding Boilerplate</a>

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Need Help?

If you encounter any issues:

1. Check the [Issues](https://github.com/leonvanzyl/agentic-coding-starter-kit/issues) section
2. Review the documentation above
3. Create a new issue with detailed information about your problem

---

**Happy coding! 🚀**


---
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ > I want to showcase AI automations as a demos for gining trusat from vistors and getting to the point of the WOW EFFECT as fast as posssible.\                     │
│   There should be implemented local GROW payments system\                                                                                                           │
│   I will run all my automnations in n8n and make.com \                                                                                                              │
│   \                                                                                                                                                                 │
│   \                                                                                                                                                                 │
│   My marketing website will have RAG Chatbot. |\                                                                                                                    │
│   I wnat all the data and docoments to be in Supabase\                                                                                                              │
│   Including RAG, Vector, SQL, Non SQL, Authentication and everything that backend needs. \                                                                          │
│   \I want to be able automatically to backup all the data to Google Cloud and save it under diferrent rules.\                                                       │
│   \                                                                                                                                                                 │
│   As well i want to implement VAPI customer service.\                                                                                                               │
│   \                                                                                                                                                                 │
│   I want to be able to add additional apps to "Afarsemon" webapp. And be able to add differnt functionality. \                                                      │
│   \\                                                                                                                                                                │
│   \  
suggest me best git strategy for development multi apps webapp in several langages. I will start with hebrew. I want to have two   │
│   apps under apps/ folder\                                                                                                                                          │
│   \                                                                                                                                                                 │
│   apps/www - marketing site\                                                                                                                                        │
│   apps/manage - Dashboard\                                                                                                                                          │
│   \                                                                                                                                                                 │
│   I want that users could login with email or google account. \                                                                                                     │
│   The can have an acess to free tools in the free of charge as a logged in users only.\                                                                             │
│   Then they will buy a monthly subscribtion or manually choose a tool they particalary will pay for. \                                                              │
│   The tool - they are actually AI Workers that performs diferrent tasks for SMBs. \                                                                                 │
│      
