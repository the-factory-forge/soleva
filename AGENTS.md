# Agent Guidelines

## Template foundation updates

Use the current Forge template toolchain and auth flow. Older local implementations
must be migrated, while customer content, styles, integrations and migration history
remain site-owned. Public-only sites keep authentication absent.
Read `../forge-spec/AGENTS.md` and its `the-forge`, `template-stack` and `site-template`
specs before implementation. See `docs/template-sync.md` for this site's history.

- Run `vpr dev` through Portless; keep the unique customer package name and use its printed URL.
- Leave local `VITE_BASE_URL` overrides unset so `PORTLESS_URL` supplies the development origin.
  Deployment still sets the confirmed public origin. Never read local env files;
  validate with `vp exec varlock load --agent`.
- Runtime tests keep port 3100. Direct checks use
  `VITE_BASE_URL=http://localhost:3100 PORTLESS=0 vpr dev --port 3100 --strictPort`.
  Never stop another site's server or proxy or occupy port 3000.
- `ENV.SITE_NAME` is an infrastructure slug; public display-name constants stay customer-owned.


## Essentials

- Stack: TypeScript + React (TanStack Start), with Drizzle ORM, shadcn/ui, and Better Auth.
- Use shadcn CLI (`vpr ui add <component>`) for adding new UI components & primitives.
- Class merging: use `cn` from `src/lib/utils.ts` (the `cn` package).
- Treat `.env.schema` as the environment source of truth. Import `ENV` from `varlock/env`; never read local secret-bearing env files. Validate with `vp exec varlock load --agent`.
- Use `lucide-react` for UI icons (use `Icon` suffix, e.g. `import { Loader2Icon } from "lucide-react"`); for brand icons use `@icons-pack/react-simple-icons` (e.g. `SiGithub`).
- Don't build after every little change. If `vpr lint` passes; assume changes work.
- For running scripts, use `vpr`, which is a shorthand for `vp run`.

## Session learnings (28.08.2026 - validated)

- **Never put React components in loaderData**: the le-van services carry Lucide icons -> Seroval crashes on `Symbol(react.forward_ref)` and the page breaks. LoaderData must be POJO-serializable (reload services via `getServiceBySlug(slug)` in head + component).
- **Positioned elements paint over static ones**: the hero <video> (static) was invisible under the poster <img> (`absolute inset-0`). For a media stack, make ALL layers positioned (the later sibling wins). CSS painting order, not DOM order.
- **Video + Lighthouse**: any video that paints during a run becomes the LCP (Chrome counts video frames). The only reliable gate is a user gesture (scroll/tap) - simulated runs never gesture. Here the choice was made to accept the video LCP (autoplay, ~54-73 mobile score).
- **Range support is mandatory for video**: the local nitro server answers 200 (full body) to Range requests - Chrome tolerates it, Safari/Firefox commonly refuse. Verify `Accept-Ranges: bytes` on the prod server (nginx/CDN).
- **Dict in the RSC stream**: the L1 pattern (dict out of stream via useDictionary) was tried and REVERTED here - it caused a double hydration (empty dict render, then re-render after the dict chunk) costing TTI. The smaller dict + faster fetch made the inline stream cheaper. Validate per site (worked on cafe, not here).
- **Lazy menu chunks on first open**: lang-switcher + mobile-nav mount on first click (fallback button opens them) - keeps Base UI out of the initial graph.
- **Font preloads**: only 400 + 800 (body + LCP h1); 500/600/700 load on demand (font-display swap).

## Topic-specific Guidelines

- [Data flow](.agents/data-flow.md) - Routing, queries, mutations, and server boundaries
- [Auth patterns](.agents/auth.md) - Route guards, middleware, auth utilities
- [TypeScript conventions](.agents/typescript.md) - Casting rules, prefer type inference
- [Workflow](.agents/workflow.md) - Workflow commands, validation approach
- [Testing](.agents/testing.md) - Focused unit, integration, and production browser checks
- [Database](.agents/database.md) - Schema and migration conventions
- [Template sync](.agents/skills/sync-forge-template/SKILL.md) - Preserve Soleva when updating its foundation

<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `vpx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `vpx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Database convention

One Postgres service, one database per site: databases are named `factory_<site>`
(e.g. `factory_soleva`), each owned by a role `factory_<site>`. A site's
`DATABASE_URL` always points to its own database - never share a database
between sites. See README.md "Database" for the full pattern.

## TanStack Query patterns

TanStack Query is the data layer (same approach as tc-website). The QueryClient
is created in `src/router.tsx` with `setupRouterSsrQueryIntegration` - loaders
share it via `context.queryClient`, components via hooks.

Rules:

- **queryOptions factory per domain**: one `src/lib/<domain>/queries.ts` exporting
  `queryOptions` factories (e.g. `authQueryOptions()` in `src/intranet/auth/queries.ts`).
  Server data comes from server functions (`src/lib/<domain>/functions.ts`).
- **Read navigation-critical data in loaders** (SSR + client): `await context.queryClient.query(options())`.
- **Read in components**: `useQuery` / `useSuspenseQuery` with the same options object
  (dedupes against the loader prefetch - same queryKey).
- **Invalidate after mutations**: set the query data (or invalidate) then
  `router.invalidate()` to re-run loaders (see `sign-out-button.tsx`).
- Never fetch data in components directly - always through the domain queries file.

## Auth routes are localized

The shared intranet lives under `src/intranet`: `/{locale}/login`, password recovery
and `/{locale}/intranet`. Public signup is disabled; administrators manage employees.
The public footer links to the intranet only when configured. Preserve Soleva's
light-only public shell and inline dictionaries; use the template auth/session flow.

## Template adaptations to preserve

- Soleva is light-only and uses Montserrat. Keep its semantic palette and public CSS font variables; do not import the template demo theme/font switchers or dark presets.
- Keep inline dictionary loader data: the out-of-stream approach was measured and reverted here.
- Preserve per-action Ads conversion labels, deferred consent loading, site-owned registry skips, and all four locales.
- Keep `prepare` (Vite+ hooks and Varlock codegen). Docker installs with `--ignore-scripts`, includes `.env.schema`, and builds with `pnpm_config_ignore_scripts=true`. The entrypoint adds local executables to PATH before running Varlock. Keep the Vite integration in `init-only` mode: `resolved-env` overrides runtime auth/DB values with build-time values.
- The September 2026 sync uses a fresh database baseline by explicit owner instruction. The owner resets local and VPS databases before applying it; never apply it over the previous schema. Subsequent releases preserve applied migrations.
- Record template reconciliation decisions and verified revisions in `docs/template-sync.md`.
