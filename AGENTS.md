# Agent Guidelines

## Essentials

- Stack: TypeScript + React (TanStack Start), with Drizzle ORM, shadcn/ui, and Better Auth.
- Use shadcn CLI (`vpr ui add <component>`) for adding new UI components & primitives.
- Use `lucide-react` for UI icons (use `Icon` suffix, e.g. `import { Loader2Icon } from "lucide-react"`); for brand icons use `@icons-pack/react-simple-icons` (e.g. `SiGithub`).
- Don't build after every little change. If `vpr lint` passes; assume changes work.
- For running scripts, use `vpr`, which is a shorthand for `vp run`.
- Port convention: port 3000 = Elias' local dev server. For runtime tests, serve on `PORT=3100` - never occupy 3000.

## Session learnings (28.08.2026 - validated)

- **Never put React components in loaderData**: the le-van services carry Lucide icons -> Seroval crashes on `Symbol(react.forward_ref)` and the page breaks. LoaderData must be POJO-serializable (reload services via `getServiceBySlug(slug)` in head + component).
- **Positioned elements paint over static ones**: the hero <video> (static) was invisible under the poster <img> (`absolute inset-0`). For a media stack, make ALL layers positioned (the later sibling wins). CSS painting order, not DOM order.
- **Video + Lighthouse**: any video that paints during a run becomes the LCP (Chrome counts video frames). The only reliable gate is a user gesture (scroll/tap) - simulated runs never gesture. Here the choice was made to accept the video LCP (autoplay, ~54-73 mobile score).
- **Range support is mandatory for video**: the local nitro server answers 200 (full body) to Range requests - Chrome tolerates it, Safari/Firefox commonly refuse. Verify `Accept-Ranges: bytes` on the prod server (nginx/CDN).
- **Dict in the RSC stream**: the L1 pattern (dict out of stream via useDictionary) was tried and REVERTED here - it caused a double hydration (empty dict render, then re-render after the dict chunk) costing TTI. The smaller dict + faster fetch made the inline stream cheaper. Validate per site (worked on cafe, not here).
- **Lazy menu chunks on first open**: lang-switcher + mobile-nav mount on first click (fallback button opens them) - keeps Base UI out of the initial graph.
- **Font preloads**: only 400 + 800 (body + LCP h1); 500/600/700 load on demand (font-display swap).

## Topic-specific Guidelines

- [TanStack patterns](.agents/tanstack-patterns.md) - Routing, data fetching, loaders, server functions, environment shaking
- [Auth patterns](.agents/auth.md) - Route guards, middleware, auth utilities
- [TypeScript conventions](.agents/typescript.md) - Casting rules, prefer type inference
- [Workflow](.agents/workflow.md) - Workflow commands, validation approach

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
  `queryOptions` factories (e.g. `authQueryOptions()` in `src/lib/auth/queries.ts`).
  Server data comes from server functions (`src/lib/<domain>/functions.ts`).
- **Prefetch in loaders** (SSR + client): `await context.queryClient.ensureQueryData(options())`.
- **Read in components**: `useQuery` / `useSuspenseQuery` with the same options object
  (dedupes against the loader prefetch - same queryKey).
- **Invalidate after mutations**: set the query data (or invalidate) then
  `router.invalidate()` to re-run loaders (see `sign-out-button.tsx`).
- Never fetch data in components directly - always through the domain queries file.

## Auth routes are localized

Auth routes live under `/_auth/$lang` (pathless `_auth` + locale layout):
`/fr/login`, `/en/signup`, `/de/app`... They render WITHOUT the site navbar
(full-screen `AuthScreen` for login/signup, `AppShell` = site navbar on top +
user sidebar on the left for the dashboard). The site navbar login link points
to `/{locale}/login`. Guards redirect with the locale preserved.
