import { createAuthClient } from "better-auth/react"

// Client-side environment variables (automatically injected by Next.js from root .env.local)
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
                process.env.NEXT_PUBLIC_APP_URL || 
                "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient