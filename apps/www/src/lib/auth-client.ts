import { createAuthClient } from "better-auth/react"
import "./auth-debug" // Auto-run debug logging in development

// Client-side environment variables (automatically injected by Next.js from root .env.local)
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
                process.env.NEXT_PUBLIC_APP_URL || 
                "http://localhost:3000"; // Fixed default port to match Next.js dev server

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    onError: (context) => {
      console.error("Auth Client Error:", context.error);
      console.error("Request context:", context);
    },
    onRequest: (_context) => {
      // Add debugging for all auth requests
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth Request initiated");
      }
    },
    onSuccess: (context) => {
      // Log successful responses in development
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth Success", context.response.status);
      }
    }
  }
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient