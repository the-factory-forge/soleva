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

- `vpr auth:generate` writes `.cache/auth.schema.generated.ts` from the Better Auth config.
- Review that candidate against `src/intranet/db/schema/auth.schema.ts`; preserve host additions, relations and applied migration history. Never replace the active schema wholesale.
- Add or change Better Auth-owned fields through the Better Auth config, then reconcile the candidate before generating and reviewing a project migration.
- When the generator leaves a JSON field as `unknown`, validate and narrow it at the first application read boundary, then let that inferred type flow downstream. Do not add an application type annotation to the generated schema.
- If Better Auth's config cannot express a compound index, partial index, check, or cross-table invariant, do not patch it into `auth.schema.ts`. Keep the enforceable structure in another schema file where practical, and enforce the remaining relationship in the relevant auth hook or transactional operation.
