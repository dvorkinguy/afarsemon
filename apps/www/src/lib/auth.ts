import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { getServerEnv } from "@afarsemon/env"

const serverEnv = getServerEnv();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    // Enable CSRF protection
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "__Host-" // Use __Host- prefix for enhanced security in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // Cache for 5 minutes
    }
  },
  trustedOrigins: serverEnv.NEXT_PUBLIC_APP_URL ? [serverEnv.NEXT_PUBLIC_APP_URL] : undefined,
})