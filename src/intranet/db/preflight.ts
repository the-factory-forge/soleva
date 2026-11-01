import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { assertMigrationsApplied } from "../components/forge/utils/database-migrations.ts";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for database preflight.");
const pool = postgres(process.env.DATABASE_URL, { max: 1 });
try {
  await assertMigrationsApplied(drizzle({ client: pool }), {
    migrationsFolder: fileURLToPath(new URL("../../../drizzle/", import.meta.url)),
  });
} finally {
  await pool.end();
}
