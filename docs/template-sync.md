# Forge template sync

## 2026-09-16

Status: completed selective reconciliation, with the intentional site adaptations below.

- Source: https://github.com/the-factory-forge/forge-template
- Verified default branch: `main` (queried with `git ls-remote --symref`, then fetched).
- Target: `1c3e3738b7148ab0e195e69ba3694f03469f182c`.
- Soleva starting commit: `d5fbac77f7b967640d32386b4ca2224d49e9907a`.
- Starting branch: `feat/content-implementation`; working tree was clean.
- Review branch: `codex/sync-forge-template`.
- Comparison base: unknown. The histories are unrelated and neither is shallow.
  Soleva originated as a v0 Next app; commit `593e459` introduced its TanStack
  migration, but does not identify an exact template revision. No ancestry was
  manufactured. Shared files and migration history were reconciled by concern
  against the fetched target. Use this target as the next comparison point while
  carrying forward the deviations below.

### Applied

- Aligned shared dependency versions with the target, including Vite+ 0.3.1,
  pnpm 12.3.4, TanStack, Better Auth 1.7.3, Base UI, and Nitro. Regenerated the
  site's lockfile; retained Leaflet and Montserrat without demo font dependencies.
- Replaced T3 Env with Varlock schema, generated types, `ENV` imports, lifecycle
  scripts, and validated startup. Kept optional analytics, OAuth, auth and database
  behavior, including phone/email conversion labels and their generic fallback.
- Switched from Babel React compilation to the current React plugin compiler;
  replaced `cnfast` and unused direct class-merging dependencies with `cn`.
- Updated Docker's pinned package manager, ignored install lifecycles, schema
  inclusion, conversion build arguments, and Varlock entrypoint. Local executable
  PATH is explicitly set because the entrypoint runs outside a package script.
- Auth config registers only configured OAuth providers. Protected dashboard
  navigation now fills the same Query cache consumed by its auth hook.
- Regenerated Better Auth's schema from config and generated
  `drizzle/20260916123445_better_auth_1_7`. It renames `provider_account_id` to
  `account_id`, removes the obsolete issuer index, and makes issuer nullable.
  Existing migrations and records are preserved.
- Added unit/E2E commands and a focused production browser suite. Updated data
  flow, auth, database, testing and workflow instructions, plus the sync skill.
- Exposed existing Montserrat font tokens in emitted CSS, preserved light-only
  rendering, added public-asset CORS, fixed button hover behavior, and adopted the
  image generator's 480px/q90 and larger/q80 convention.

### Intentional deviations and preserved behavior

- **Runtime environment:** use `ssrInjectMode: "init-only"`, with `varlock run`
  at startup. The target's `resolved-env` setting embedded empty build-time auth
  values and overrode valid runtime credentials: the same build returned 404 on
  login after auth was enabled. The runtime mode was verified with that same
  artifact first in showcase mode, then with an isolated database.
- **Auth history:** the template drops `account.issuer`; Soleva retains it as a
  nullable, non-input additional field in Better Auth config. This preserves old
  data and survives schema regeneration. No production migration was executed.
- **Client design/content:** preserved all four dictionaries, public pages,
  contacts, data, assets, logos, palette, Montserrat, video autoplay, lazy menus,
  portal lightbox, animation list semantics and responsive image adaptations.
  Theme/font demo controls, example routes, demo tests and preset CSS were not
  introduced. Inactive legacy preset files remain unchanged.
- **Loading:** retained inline dictionaries because Soleva measured and reverted
  the template's out-of-stream dictionary approach. Retained dev warmup and
  dependency prebundling. Dashboard auth uses the ordinary query freshness policy.
- **SEO/deployment:** preserved the configured site URL, all localized metadata,
  absolute share-image normalization, noindex handling, legacy redirects and
  machine-readable endpoints. Did not add the template's hardcoded canonical host
  or redirect staging visitors to a new domain. Default Start CSRF handling remains.
- **Registry:** no registry pull; Soleva's customized components and skip list
  remain intact. Relevant template fixes were applied manually. No new registry
  revision is claimed.
- **Tooling:** package scripts use `pnpm dlx` rather than the template's `vpx`
  shorthand, which is unavailable in this environment's noninteractive scripts.
  Intent discovery also includes `drizzle-kit` for the site's migrations.
- Template demo documentation, unrelated local skills, and template project
  history were not copied over Soleva's project records.

### Validation

- Baseline: lint/type checking passed with existing warnings; 2 redirect tests passed.
- Final lint/type checking passed with existing warnings.
- Unit tests passed: redirect safety and optional Ads-label fallback.
- Production Playwright suite passed on desktop and mobile: all four locales,
  client navigation, language switching, deferred consent, brand font/colors,
  public asset access, and disabled-auth redirects/API behavior. External requests
  were blocked and synthetic analytics IDs used. Desktop/mobile visuals inspected.
- Full site audit passed: 84 localized pages, 3,620 internal links, 115 assets,
  70 legacy redirects, 404 handling, metadata, sitemap, robots and data endpoints.
- An isolated PostgreSQL 18 container verified migration idempotency and retention
  of old IDs, passwords, issuer values and sessions. The built app then verified
  migrated login, new signup, authenticated/anonymous guards in all four locales,
  logout cookie clearing, and server-side session revocation.
- Varlock safe validation, frozen-lockfile installation, shell syntax and
  `git diff --check` passed. Drizzle generation reports `no_changes`.
- **Existing formatting debt:** `vp check` reports 12 unchanged files:
  `MECHANICS.md`, three content/migration reports under `docs/`,
  `scripts/scrape-soleva-org.mjs`, `home-pillars.tsx`, `home-problem.tsx`,
  `layouts/not-found-page.tsx`, `navigation/lang-switcher.tsx`,
  `ui/pillar-suggestions.tsx`, `lib/data/team.ts`, and `routes/_auth/$lang.tsx`.
  They were left untouched; changed files pass targeted formatting.
- The target already pairs React plugin 6.1.1 with compiler 0.149.0 despite its
  narrower peer range, and TypeScript 7 with older ESLint-plugin peer ranges.
  These install warnings remain; production builds and type-aware lint succeeded.
- Docker image construction and live OAuth-provider callbacks were not exercised.
  No deployment, push, or production database change was performed.

Future deployment must apply the generated migration before using Better Auth
1.7.3 with an existing database. The Docker entrypoint already runs migrations
when `DATABASE_URL` is configured. No new credentials are required for showcase mode.

## 2026-09-26 bulk sync

Source: `the-factory-forge/forge-template`, remotely verified default branch `main`.
Pinned target: `b81b90ec0c58d5dc6cd57d383864cb811464f4b4`.
Starting child commit: `30aaab3e4ae9b12f569630cee5a7a87e5e2e890f` on `main`; clean at the captured baseline.
Comparison base/evidence: `1c3e3738b7148ab0e195e69ba3694f03469f182c` (2026-09-16 reconciliation).

Applied the applicable foundation delta by concern: unique Portless development
origin, infrastructure `SITE_NAME`, pinned shared toolchain/lockfile, Varlock,
Nitro/evlog error reporting with redaction, consent lifecycle and updated agent guidance.
Shared dependency versions match the target; client-only dependencies remain.
Template demo pages/content/fonts, new-site bootstrap workflows and unrelated starter
history are intentionally excluded. Client routes/assets/public dictionaries are retained.

Four locales, all public content/assets, Montserrat, the light-only palette, measured inline dictionary loading, hero video, newsletter placeholder and per-action Ads labels. Auth moves from `src/lib/auth` to `src/intranet`; legacy `/app` URLs redirect to the shared intranet and public signup is removed. The public navbar can render inside the shared sidebar
without covering its controls, and auth-language changes preserve reset tokens.

The owner confirmed no database-backed customer is live and **will reset both local
and VPS databases**. Old migration chains are replaced by `drizzle/20260926103351_baseline/migration.sql` generated from
the current schema, with the shared atomic empty-database admin bootstrap appended.
Legacy auth issuer compatibility is removed where present; custom module tables remain.
This is a fresh-install baseline, not an upgrade migration. Reset the complete database
selected by this site's `DATABASE_URL`, including Drizzle history, then run
`vpr db:migrate` or deploy through the existing Docker entrypoint. Do not run the new
baseline over the old schema. The initial login is `admin@example.com` / `admin`;
change it during setup. The sync did not reset customer local or VPS databases.
Private runtime credentials use Varlock `init-only`; nonsecret server settings such as
`EMAIL_FROM`, `GOOGLE_CLIENT_ID` and storage routing fields are marked `@dynamic`, so Docker builds without secrets
can enable auth at startup; this deliberate adaptation is covered by intranet E2E.
Unlocalized `/intranet` goes to the localized shared flow instead of starter demo UI.

### VPS environment migration

Live env files were not read or modified; deployed values are **unverified**.
Values below are nonsecret names/defaults, not a dump of deployment configuration.

| Variable / contract | Before → after | VPS action and lifecycle |
| --- | --- | --- |
| `CONTAINER_NAME` → `SITE_NAME` | New schema default `soleva`; Compose accepts old `CONTAINER_NAME` while `SITE_NAME` is unset. | Set `SITE_NAME` to the existing container label to preserve identity, or use `soleva` for a new deployment. Rebuild/recreate service; old key may be removed once the new key is set. |
| `PORTLESS_URL` (added), `VITE_BASE_URL` (resolution changed) | Portless supplies local origin; explicit `VITE_BASE_URL` wins. | `PORTLESS_URL` is development-only: leave it unset on VPS. Keep/set `VITE_BASE_URL` to the actual public HTTPS origin at both build and runtime; image rebuild required for changed `VITE_*` values. Locally remove stale explicit origin overrides when using Portless. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (retired consumers) | GitHub OAuth → shared Google-only flow; old keys remain accepted for compatibility. | Remove unused GitHub keys after deployment. Optional `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` continue; register `<VITE_BASE_URL>/api/auth/callback/google`. Restart after credential changes. |
| `EMAIL_API_KEY`, `EMAIL_FROM` (added) | Absent → optional Resend settings for reset/verification email. | Set both to enable mail; otherwise recovery remains unavailable. Runtime restart; no browser rebuild just for these private settings. |
| Nonsecret server settings (`EMAIL_FROM`, `GOOGLE_CLIENT_ID`) | Build-inlined → runtime-dynamic resolution. | Keep their values; rebuild once for this fix, then restart after changing runtime settings. Private credentials remain runtime-only. |
| `DATABASE_URL`, `BETTER_AUTH_SECRET` (values unchanged; schema reset required) | Same runtime keys with fresh database baseline and shared auth. | Owner resets the site database and Drizzle history, then rebuilds/redeploys and applies the baseline. Keep both configured to enable auth. Reset/setup is still outstanding; it was not a validation action. |

Shared auth forms retain Terminal60's POST fallback and use the installed router
hydration signal to keep controls inactive until React can handle submission. This
fixes an observed early native form submission and is applied consistently to all
three authenticated clients; it is an intentional adaptation beyond the target.

### Verification

Status: **reconciled locally** with the pinned target and documented adaptations.

- `vp run lint`: passed (pre-existing deprecation warnings remain where applicable).
- `vp test run`: 5 tests passed, including consent and Portless environment contracts.
- `vp run test:e2e`: 10 production browser tests passed; owns its build/server lifecycle.
- `vp exec varlock load --agent`: passed without reading live env files directly.
- `vp install --lockfile-only --frozen-lockfile --ignore-scripts --offline`: passed.
- Changed source formatted; `git diff --check` passed. Public assets and public JSON
  dictionaries match the captured child baseline.
- Intranet production E2E: 13 tests passed with isolated local Postgres,
  fake email/Google provider boundaries and (Terminal60 only) isolated MinIO. Builds
  omit runtime credentials/settings; startup restores them. Includes fresh sessions,
  employee permissions, password recovery/revocation and hydration-safe auth controls.
- Fresh schema baseline applied successfully to an empty disposable database. Bootstrap
  concurrency/idempotency checks passed. No customer database was reset or migrated.

Client changes remain reviewable on the sync branch; no push or VPS deployment was
performed. Live deployment values remain unverified. The owner will perform the
required local/VPS resets before applying this release where a database exists.
