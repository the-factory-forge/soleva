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
