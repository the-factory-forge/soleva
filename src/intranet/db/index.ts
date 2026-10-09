import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "varlock/env";

import { authRelations } from "#/intranet/db/schema/auth.schema";
import { relations } from "#/intranet/db/schema/relations";

export const db = drizzle({
  client: postgres(ENV.DATABASE_URL),
  // authRelations uses defineRelationsPart,
  // so it must come after the main relations.
  // https://orm.drizzle.team/docs/relations-v2#relations-parts
  relations: { ...relations, ...authRelations },
});
