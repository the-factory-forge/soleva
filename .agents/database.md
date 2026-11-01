# Database Conventions

## Typed Text over Native Enums

- Prefer PostgreSQL `text` columns with TypeScript string-union types over native database enums.
- Define reusable database value types in `src/intranet/db/schema/types.ts` and apply them with Drizzle's `text().$type<Type>()`.
- Do not introduce `pgEnum` unless a concrete database-level requirement makes a native enum necessary. Document that requirement beside the schema when it occurs.
- Type-level constraints do not validate untrusted runtime values. Continue validating at system boundaries and use database checks where an invariant requires database enforcement.

```ts
export type ProductVisibility = "draft" | "public" | "unlisted" | "archived";

visibility: text().$type<ProductVisibility>().notNull().default("public");
```

## Generated Better Auth Schema

- `vpr auth:generate` reads `src/intranet/auth/auth.ts` and writes the review candidate `.cache/auth.schema.generated.ts`; it leaves the active `src/intranet/db/schema/auth.schema.ts` unchanged.
- Add or change Better Auth-owned fields through the Better Auth config. Compare the generated candidate with the active schema, then reconcile only reviewed changes while preserving host fields and Relations v2 definitions. Keep application-specific additions outside generated ownership.
- For a schema change, run `vpr db:generate`, review the incremental migration, then run `vpr db:migrate` as a separate authorized step. Keep the project's existing `drizzle/` history intact; generation never authorizes a database migration. See [Database](../README.md#database).
- When the generator leaves a JSON field as `unknown`, validate and narrow it at the first application read boundary, then let that inferred type flow downstream. Do not add an application type annotation to the generated schema.
- If Better Auth's config cannot express a compound index, partial index, check, or cross-table invariant, do not patch it into `auth.schema.ts`. Keep the enforceable structure in another schema file where practical, and enforce the remaining relationship in the relevant auth hook or transactional operation.

## Runtime Queries and Installed Modules

- Use typed Drizzle queries in host adapters and installed Registry runtime modules. Schema definitions may use SQL for constraints, generated columns and indexes; reviewed migrations and backfills retain their separate verification.
- Keep schema definitions in `schema/` directories or `schema.ts` files, including installed companions' `server/schema.ts`. The runtime SQL check recognizes both conventions and still scans the neighboring runtime modules. Review older installed modules against their recorded revision before adopting the check; resolve runtime SQL departures separately from valid schema expressions.
- During a Drizzle upgrade, exercise installed modules with the destination's pinned ORM, driver and migration tool. Include nested JSON writes/reads, generated columns and transaction rollback; preserve existing migrations and validate host transaction adapters. Pass objects to typed `jsonb` columns and let the column encoder serialize them. A dependency upgrade alone does not establish that an older parameterized SQL adapter is compatible.
