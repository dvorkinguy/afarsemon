import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getServerEnv } from "@afarsemon/env";

const serverEnv = getServerEnv();
const client = postgres(serverEnv.POSTGRES_URL);
export const db = drizzle(client, { schema });
