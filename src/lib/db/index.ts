import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "varlock/env";

import { authRelations } from "#/lib/db/schema/auth.schema";
import { relations } from "#/lib/db/schema/relations";

// Showcase sites run without a database - db is null when DATABASE_URL is unset.
// Auth stays disabled until a database is configured (see .env.schema).
export const db = ENV.DATABASE_URL
  ? drizzle({
      client: postgres(ENV.DATABASE_URL),
      // authRelations uses defineRelationsPart,
      // so it must come after the main relations.
      // https://orm.drizzle.team/docs/relations-v2#relations-parts
      relations: { ...relations, ...authRelations },
    })
  : null;
