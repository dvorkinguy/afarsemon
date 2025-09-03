import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "./db"
import * as schema from "./schema"
import { getServerEnv } from "@afarsemon/env"

const serverEnv = getServerEnv();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  baseURL: serverEnv.BETTER_AUTH_URL || serverEnv.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      // Remove explicit redirectURI to let Better Auth generate it automatically
      // This ensures it matches the baseURL + /api/auth/callback/google
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for development - no email service configured
    minPasswordLength: 6, // Reduced for easier testing
    maxPasswordLength: 128,
    autoSignIn: true, // Sign in user automatically after successful registration
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending for password reset
      console.log(`Password reset requested for ${user.email}. Reset URL: ${url}`);
      // In production, replace with actual email service
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending for verification
      console.log(`Email verification requested for ${user.email}. Verification URL: ${url}`);
      // In production, replace with actual email service like Resend, SendGrid, etc.
    },
    sendOnSignUp: true, // Automatically send verification email on sign up
    autoSignInAfterVerification: true, // Sign in user after successful verification
    expiresIn: 3600, // 1 hour
  },
  advanced: {
    // Security configurations
    useSecureCookies: process.env.NODE_ENV === "production",
    disableCSRFCheck: false, // Keep CSRF protection enabled
    cookiePrefix: process.env.NODE_ENV === "production" ? "__Host-" : "", // Use __Host- prefix only in production
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // CSRF protection
    },
    // IP tracking for security
    ipAddress: {
      disableIpTracking: false,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // Cache for 5 minutes
    }
  },
  trustedOrigins: serverEnv.NEXT_PUBLIC_APP_URL ? [serverEnv.NEXT_PUBLIC_APP_URL] : ["http://localhost:3000"],
  plugins: [
    nextCookies(), // Must be the last plugin for Next.js cookie handling
  ],
})