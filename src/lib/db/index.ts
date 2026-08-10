import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "#/env/server";
import { authRelations } from "#/lib/db/schema/auth.schema";
import { relations } from "#/lib/db/schema/relations";

// Showcase sites run without a database - db is null when DATABASE_URL is unset.
// Auth stays disabled until a database is configured (see .env.example).
export const db = env.DATABASE_URL
  ? drizzle({
      client: postgres(env.DATABASE_URL),
      // authRelations uses defineRelationsPart,
      // so it must come after the main relations.
      // https://orm.drizzle.team/docs/relations-v2#relations-parts
      relations: { ...relations, ...authRelations },
    })
  : null;
