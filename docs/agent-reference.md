# Project reference

Read the sections linked from [AGENTS.md](../AGENTS.md) when the task requires
them. Paths and commands below are relative to this project root. Local rules
and recorded departures take precedence over template defaults. Optional
integration guidance applies only when the feature is installed or requested.

## Local runtime

- Run `vpr dev` through Portless; keep the unique customer package name and use its printed URL.
- Leave local `VITE_BASE_URL` overrides unset so `PORTLESS_URL` supplies the development origin.
  Deployment still sets the confirmed public origin. Never read local env files;
  validate with `vp exec varlock load --agent`.
- Runtime tests keep port 3100. Direct checks use
  `VITE_BASE_URL=http://localhost:3100 PORTLESS=0 vpr dev --port 3100 --strictPort`.
  Never stop another site's server or proxy or occupy port 3000.
- `ENV.SITE_NAME` is an infrastructure slug; public display-name constants stay customer-owned.

## Application conventions

- Stack: TypeScript + React (TanStack Start), with Drizzle ORM, shadcn/ui, and Better Auth.
- Use shadcn CLI (`vpr ui add <component>`) for adding new UI components & primitives.
- Class merging: use `cn` from `src/lib/utils.ts` (the `cn` package).
- Treat `.env.schema` as the environment source of truth. Import `ENV` from `varlock/env`; never read local secret-bearing env files. Validate with `vp exec varlock load --agent`.
- Use `lucide-react` for UI icons (use `Icon` suffix, e.g. `import { Loader2Icon } from "lucide-react"`); for brand icons use `@icons-pack/react-simple-icons` (e.g. `SiGithub`).
- Don't build after every little change. If `vpr lint` passes; assume changes work.
- For running scripts, use `vpr`, which is a shorthand for `vp run`.

## Measured site behavior

- **Never put React components in loaderData**: the le-van services carry Lucide icons -> Seroval crashes on `Symbol(react.forward_ref)` and the page breaks. LoaderData must be POJO-serializable (reload services via `getServiceBySlug(slug)` in head + component).
- **Positioned elements paint over static ones**: the hero <video> (static) was invisible under the poster <img> (`absolute inset-0`). For a media stack, make ALL layers positioned (the later sibling wins). CSS painting order, not DOM order.
- **Video + Lighthouse**: any video that paints during a run becomes the LCP (Chrome counts video frames). The only reliable gate is a user gesture (scroll/tap) - simulated runs never gesture. Here the choice was made to accept the video LCP (autoplay, ~54-73 mobile score).
- **Range support is mandatory for video**: the local nitro server answers 200 (full body) to Range requests - Chrome tolerates it, Safari/Firefox commonly refuse. Verify `Accept-Ranges: bytes` on the prod server (nginx/CDN).
- **Dict in the RSC stream**: the L1 pattern (dict out of stream via useDictionary) was tried and REVERTED here - it caused a double hydration (empty dict render, then re-render after the dict chunk) costing TTI. The smaller dict + faster fetch made the inline stream cheaper. Validate per site (worked on cafe, not here).
- **Lazy menu chunks on first open**: lang-switcher + mobile-nav mount on first click (fallback button opens them) - keeps Base UI out of the initial graph.
- **Font preloads**: only 400 + 800 (body + LCP h1); 500/600/700 load on demand (font-display swap).

## Database

One Postgres service, one database per site: databases are named `factory_<site>`
(e.g. `factory_soleva`), each owned by a role `factory_<site>`. A site's
`DATABASE_URL` always points to its own database - never share a database
between sites. See README.md "Database" for the full pattern.

## Query layout

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

## Localized auth

The shared intranet lives under `src/intranet`: `/{locale}/login`, password recovery
and `/{locale}/intranet`. Public signup is disabled; administrators manage employees.
The public footer links to the intranet only when configured. Preserve Soleva's
light-only public shell and inline dictionaries; use the template auth/session flow.
