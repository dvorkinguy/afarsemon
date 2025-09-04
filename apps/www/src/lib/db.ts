import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getServerEnv } from "@afarsemon/env";

const serverEnv = getServerEnv();

// Configure PostgreSQL client with proper production settings
const client = postgres(serverEnv.POSTGRES_URL, {
  // Production database connection configuration
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
  // Ensure proper connection handling in serverless environments
  max_lifetime: 60 * 30, // 30 minutes max connection lifetime
  // Better error handling
  onnotice: process.env.NODE_ENV === 'development' ? console.log : undefined,
  debug: process.env.NODE_ENV === 'development',
});

export const db = drizzle(client, { schema });
