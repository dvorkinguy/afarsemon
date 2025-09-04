import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getServerEnv } from "@afarsemon/env";

const serverEnv = getServerEnv();

// Optimized PostgreSQL client configuration for Vercel serverless environment
const client = postgres(serverEnv.POSTGRES_URL, {
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  
  // Serverless-optimized connection pool settings
  max: 1, // Single connection for serverless functions
  idle_timeout: 0, // No idle timeout - let Vercel handle cleanup
  connect_timeout: 30, // Longer timeout for cold starts
  
  // Connection lifecycle for serverless
  max_lifetime: 0, // No max lifetime - let connection be reused across invocations
  prepare: false, // Disable prepared statements for better serverless compatibility
  
  // Transform configuration for production environments
  transform: process.env.NODE_ENV === 'production' ? {
    undefined: null, // Transform undefined to null for PostgreSQL compatibility
  } : undefined,
  
  // Error handling and debugging
  onnotice: process.env.NODE_ENV === 'development' ? console.log : undefined,
  debug: process.env.NODE_ENV === 'development',
  
  // Additional production settings
  connection: {
    application_name: 'afarsemon-app',
    // Enable keep-alive for production connections
    ...(process.env.NODE_ENV === 'production' && {
      options: '--search_path=public'
    })
  }
});

export const db = drizzle(client, { schema });
