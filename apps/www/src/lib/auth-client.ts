import { createAuthClient } from "better-auth/react"
import "./auth-debug" // Auto-run debug logging in development

// Client-side environment variables with production-first resolution
// In production, use production URLs; in development, fallback to localhost
const getBaseURL = () => {
  // In production, prioritize production URLs
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
           process.env.NEXT_PUBLIC_APP_URL || 
           (typeof window !== 'undefined' ? window.location.origin : "https://afarsemon.com");
  }
  
  // In development, prioritize localhost
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
         process.env.NEXT_PUBLIC_APP_URL || 
         (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000");
};

const baseURL = getBaseURL();

// Create a Set to track circular references
const seen = new WeakSet();

// Debug logging for client-side configuration
if (typeof window !== 'undefined') {
  console.log('[Auth Client] Initializing with:', {
    baseURL,
    windowOrigin: window.location.origin,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    environment: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production'
  });
  
  // Warn if production is using localhost URLs
  if (process.env.NODE_ENV === 'production' && baseURL.includes('localhost')) {
    console.warn('⚠️ Production environment is using localhost URL. This may cause authentication issues.');
    console.warn('Check your environment variables configuration in your deployment platform.');
  }
}

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    onError: (context) => {
      // Enhanced error logging to capture all details
      console.error("=== Auth Client Error Details ===");
      
      // Try to extract error details from different sources
      const error = context.error;
      
      // Log the raw error object
      console.error("Raw error object:", error);
      
      // Check if error has properties that aren't being serialized
      if (error && typeof error === 'object') {
        console.error("Error type:", error.constructor.name);
        console.error("Error properties:", Object.keys(error));
        console.error("Error entries:", Object.entries(error));
        
        // Try to stringify with a replacer to catch circular references
        try {
          console.error("Stringified error:", JSON.stringify(error, (key, value) => {
            if (key && typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return '[Circular]';
              }
              seen.add(value);
            }
            return value;
          }));
        } catch (e) {
          console.error("Could not stringify error:", e);
        }
      }
      
      // Log the full context object
      console.error("Full request context:", {
        error: context.error,
        response: context.response,
        responseHeaders: context.response?.headers,
        responseStatus: context.response?.status,
        responseStatusText: context.response?.statusText,
        // Log the entire context as-is to see all available properties
        fullContext: context,
      });
      
      // Try to get error message from different sources
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as Record<string, unknown>).message);
      }
      
      console.error("Extracted error message:", errorMessage);
      console.error("=== End Auth Client Error Details ===");
    },
    onRequest: (context) => {
      // Enhanced request logging
      if (process.env.NODE_ENV === 'development') {
        console.log("=== Auth Request Details ===");
        console.log("URL:", context.url);
        console.log("Full context:", context);
        console.log("=== End Auth Request Details ===");
      }
    },
    onSuccess: (context) => {
      // Enhanced success logging
      if (process.env.NODE_ENV === 'development') {
        console.log("=== Auth Success Details ===");
        console.log("Status:", context.response.status);
        console.log("Response data:", context.data);
        console.log("=== End Auth Success Details ===");
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