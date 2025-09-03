"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  validateAuthData,
  signUpSchema,
  signInSchema,
  passwordResetRequestSchema,
  changePasswordSchema,
  signInRateLimiter,
  signUpRateLimiter,
  passwordResetRateLimiter,
} from "./auth-validation";

// Get client IP for rate limiting
async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}

// Sign up server action with validation
export async function signUpAction(formData: FormData) {
  const clientIP = await getClientIP();
  
  // Rate limiting check
  if (!signUpRateLimiter.isAllowed(clientIP)) {
    const remainingTime = Math.ceil(signUpRateLimiter.getRemainingTime(clientIP) / 1000 / 60);
    return {
      success: false,
      error: `Too many sign up attempts. Please try again in ${remainingTime} minutes.`,
    };
  }

  // Extract and validate form data
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  };

  const validation = validateAuthData(signUpSchema, rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: validation.data,
      headers: await headers(),
    });

    return {
      success: true,
      message: "Account created successfully. Please check your email for verification.",
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create account. Please try again.",
    };
  }
}

// Sign in server action with validation
export async function signInAction(formData: FormData) {
  const clientIP = await getClientIP();
  
  // Rate limiting check
  if (!signInRateLimiter.isAllowed(clientIP)) {
    const remainingTime = Math.ceil(signInRateLimiter.getRemainingTime(clientIP) / 1000 / 60);
    return {
      success: false,
      error: `Too many sign in attempts. Please try again in ${remainingTime} minutes.`,
    };
  }

  // Extract and validate form data
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = validateAuthData(signInSchema, rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        ...validation.data,
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
    };
  }
}

// Sign out server action
export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    
    redirect("/");
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "Failed to sign out. Please try again.",
    };
  }
}

// Password reset request server action
export async function requestPasswordResetAction(formData: FormData) {
  const clientIP = await getClientIP();
  
  // Rate limiting check
  if (!passwordResetRateLimiter.isAllowed(clientIP)) {
    const remainingTime = Math.ceil(passwordResetRateLimiter.getRemainingTime(clientIP) / 1000 / 60);
    return {
      success: false,
      error: `Too many password reset attempts. Please try again in ${remainingTime} minutes.`,
    };
  }

  const rawData = {
    email: formData.get("email"),
  };

  const validation = validateAuthData(passwordResetRequestSchema, rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    await auth.api.forgetPassword({
      body: validation.data,
      headers: await headers(),
    });

    return {
      success: true,
      message: "If an account with this email exists, you will receive a password reset link.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    // Don't reveal whether the email exists or not for security
    return {
      success: true,
      message: "If an account with this email exists, you will receive a password reset link.",
    };
  }
}

// Change password server action (for authenticated users)
export async function changePasswordAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to change your password.",
    };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  };

  const validation = validateAuthData(changePasswordSchema, rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        newPassword: validation.data.newPassword,
        currentPassword: validation.data.currentPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Password changed successfully. All other sessions have been logged out.",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to change password. Please check your current password.",
    };
  }
}

// Get current session (helper for server components)
export async function getCurrentSession() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

// Verify email action
export async function verifyEmailAction(token: string) {
  try {
    await auth.api.verifyEmail({
      query: { token },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Email verified successfully. You can now sign in.",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify email. The link may be expired or invalid.",
    };
  }
}

// Send verification email action
export async function sendVerificationEmailAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
  };

  const validation = validateAuthData(passwordResetRequestSchema, rawData); // Using same schema as it only validates email
  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email: validation.data.email,
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Verification email sent. Please check your inbox.",
    };
  } catch (error) {
    console.error("Send verification email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification email.",
    };
  }
}