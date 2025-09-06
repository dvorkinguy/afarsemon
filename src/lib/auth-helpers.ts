import { auth } from "./auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

/**
 * Get session from request for API routes
 */
export async function getSessionFromRequest(request?: NextRequest) {
  try {
    // Get the session using Better Auth's built-in method
    const session = await auth.api.getSession({
      headers: request ? Object.fromEntries(request.headers.entries()) : await headers(),
    });

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Require authentication for an API route
 * Returns the session if authenticated, throws an error otherwise
 */
export async function requireAuth(request?: NextRequest) {
  const session = await getSessionFromRequest(request);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return session;
}

/**
 * Check if user has admin role (for sensitive endpoints like diagnostics)
 */
export async function requireAdmin(request?: NextRequest) {
  const session = await requireAuth(request);
  
  // Check if user has admin role
  // You may need to adjust this based on your user schema
  // For now, we'll use email domain check as an example
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const isAdmin = session.user.email && adminEmails.includes(session.user.email);
  
  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required");
  }
  
  return session;
}