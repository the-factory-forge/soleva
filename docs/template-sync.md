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

| Variable / contract                                                            | Before → after                                                                                | VPS action and lifecycle                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CONTAINER_NAME` → `SITE_NAME`                                                 | New schema default `soleva`; Compose accepts old `CONTAINER_NAME` while `SITE_NAME` is unset. | Set `SITE_NAME` to the existing container label to preserve identity, or use `soleva` for a new deployment. Rebuild/recreate service; old key may be removed once the new key is set.                                                                                    |
| `PORTLESS_URL` (added), `VITE_BASE_URL` (resolution changed)                   | Portless supplies local origin; explicit `VITE_BASE_URL` wins.                                | `PORTLESS_URL` is development-only: leave it unset on VPS. Keep/set `VITE_BASE_URL` to the actual public HTTPS origin at both build and runtime; image rebuild required for changed `VITE_*` values. Locally remove stale explicit origin overrides when using Portless. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (retired consumers)                 | GitHub OAuth → shared Google-only flow; old keys remain accepted for compatibility.           | Remove unused GitHub keys after deployment. Optional `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` continue; register `<VITE_BASE_URL>/api/auth/callback/google`. Restart after credential changes.                                                                        |
| `EMAIL_API_KEY`, `EMAIL_FROM` (added)                                          | Absent → optional Resend settings for reset/verification email.                               | Set both to enable mail; otherwise recovery remains unavailable. Runtime restart; no browser rebuild just for these private settings.                                                                                                                                    |
| Nonsecret server settings (`EMAIL_FROM`, `GOOGLE_CLIENT_ID`)                   | Build-inlined → runtime-dynamic resolution.                                                   | Keep their values; rebuild once for this fix, then restart after changing runtime settings. Private credentials remain runtime-only.                                                                                                                                     |
| `DATABASE_URL`, `BETTER_AUTH_SECRET` (values unchanged; schema reset required) | Same runtime keys with fresh database baseline and shared auth.                               | Owner resets the site database and Drizzle history, then rebuilds/redeploys and applies the baseline. Keep both configured to enable auth. Reset/setup is still outstanding; it was not a validation action.                                                             |

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

---

## Reconciliation — 2026-10-09

- Source: <https://github.com/the-factory-forge/forge-template>, remote default branch `main`, verified with `git ls-remote --symref` and fetched into this repository.
- Reconciled target: `143c1707bdfcd9a9854dfbb49027ade980e01a1e`.
- Site starting commit: `f0177038a2ecc3e77617d8f2d3af27830cf4e0d2` on `main`; initially clean.
- Review branch: `agent/sync-forge-template-20261009`.
- Comparison evidence: `b81b90ec0c58d5dc6cd57d383864cb811464f4b4`, from this site’s previous completed selective-sync record.
- Strategy: selective integration, preserving the site's independent history. No ancestry-only merge, reset, replacement lockfile or registry upgrade.
- Status: reconciled with the customer differences below. Use this immutable target as the next comparison point while carrying those differences forward.

### Integrated and preserved

Updated overlapping dependencies to the pinned target, pnpm to 12.10.1 and Vite+ to 1.1.0; regenerated this site's own lockfile. Docker uses the same package manager. Production SSR uses Varlock `init-only` so runtime configuration is not baked into the server bundle; existing stronger runtime handling is retained.

Updated the site sync and dependency-update guidance. Added customer-specific `PRODUCT.md`, `DESIGN.md` and Impeccable code-first configuration, and linked them from `AGENTS.md`. The template remote and `template/HEAD` resolve to the target locally. Remote configuration is not transmitted by a push: the instructions describe adding/fetching it and refreshing its HEAD after a fresh clone. The immutable record, not a moving HEAD alone, identifies applied work.

Existing cookie consent behavior already includes the registry fixes and remains site-owned. Shared status colors were added where missing without replacing the customer palette. Public copy, contacts, media, fonts, locale choices, routes, SEO/analytics contracts and existing migration files were preserved. Template sample pages, demo controls, global layout/FAQ width changes and the template's own TanStarter upstream history are not imported. No production values or secret env files were read or edited.

The installed intranet now follows the target's required database/signing-secret contract, direct auth/session loading, current guards and runtime mail/OAuth configuration. Footer entry and localized sign-out behavior are covered. Public-only mode means removing the intranet at its optional module boundary, not silently disabling an installed intranet with empty credentials. The bulk-sync instruction to migrate old auth takes precedence over older optional-auth language in the generic sync skill/spec. Existing migration history, module permissions and storage prefixes remain intact.

### Environment migration / VPS handoff

Deployed values are unverified. These are rollout instructions, not confirmation that a VPS deployment or production migration occurred. Rebuild the image and recreate/restart the app to take the code/toolchain changes. Keep current `VITE_BASE_URL` and analytics/Ads build arguments; changing any browser `VITE_*` value requires an image rebuild.

| Variable or setting                   | Old → new                                                                                  | Required VPS / local action                                                                                                                                                            | Restart / data impact                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`, `BETTER_AUTH_SECRET`  | Optional installed auth → required                                                         | Set/retain the real per-site PostgreSQL URL and stable signing secret in Dokploy runtime env before deploying. Do not use build placeholders or the local exec resolver in production. | Rebuild image and restart/recreate app; startup validates config and runs that site's migration chain. |
| Local example `DATABASE_URL`          | Empty → `exec("node scripts/local-database.mjs")`                                          | Development only: opt in through `.env.local`; preserve an existing correct explicit URL. Production still needs the real URL.                                                         | No VPS change; local resolver discovers/reuses the Compose service.                                    |
| Local Compose port allocation         | Configurable host port → automatically assigned loopback port; container port stays `5432` | No port setting is needed; the local resolver discovers the assigned port. Preserve the existing database volume.                                                                      | Local service recreation only; do not delete the existing volume. No VPS mapping change is prescribed. |
| `VITE_GA_MEASUREMENT_ID`              | Same optional value; schema example added                                                  | No new value required; keep analytics/Ads settings.                                                                                                                                    | Public-value changes still need an image rebuild.                                                      |
| `PORTLESS_URL`, site/storage identity | Existing development origin and identity preserved                                         | Do not add Portless-only values to VPS env or rename existing S3 prefixes/volumes.                                                                                                     | No data movement required.                                                                             |

### Validation

- Frozen install and agent-safe Varlock load passed with synthetic validation credentials where required; deployed configuration was not inspected.
- Lint/type check passed (pre-existing warnings remain); unit tests: 5 passed.
- Public production-build/browser suite: 10 passed; desktop/mobile screenshots inspected. External requests were blocked; no real enquiries, email or analytics events were submitted.
- Impeccable doctor reports no findings. Changed files were formatted; `git diff --check` passed.
- Auth/profile/employees/bootstrap checks passed across the affected suites and focused reruns. Google initiation/failure is exercised with fake local credentials; password recovery uses a local mail fake. Builds use placeholder credentials and servers receive the disposable DB and mail config only at runtime.
- Disposable local database resolver/start/reuse/port checks passed. Existing local and production volumes were not touched.

`vp check` still reports formatting debt in unchanged files. These are not type/lint failures or unresolved template changes. The exact unchanged paths found in this run are:

- `MECHANICS.md`
- `docs/client-migration-report.md`
- `docs/content-integration-plan.md`
- `docs/content-recovery-plan.md`
- `docs/template-sync.md`
- `scripts/scrape-soleva-org.mjs`
- `src/components/layouts/not-found-page.tsx`
- `src/components/ui/accordion.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/sheet.tsx`
- `src/lib/data/team.ts`

No live OAuth callback, production email delivery, external registry access, production Docker deployment or production DB migration was performed. Prior unrelated external/account follow-ups remain outside this sync. The independent Corner Factory website and dirty forge-spec work are excluded because they are not generated-site migrations.

## Reconciliation — 2026-10-13

- Source: <https://github.com/the-factory-forge/forge-template>, canonical default branch `main`.
- Reconciled target: `e43657ee3023805b9f7afb50fa39c28e980476e6`, published `v0.0.0-rc.2`.
- Provider release gates passed: the remote template tag peels to its main tip above; registry `v0.0.0-rc.4` peels to remote main `01d79062edf17fa26fd16e9f76216a270bed5263`. Rechecked after the user published rc.4. No release exception was needed. Dirty provider files are excluded.
- Site starting commit: `1b07f0b18030671afc1c57400edfd77cf6a8915c` on `main`.
- Review branch: `agent/sync-forge-template-20261013`, isolated from the original checkout.
- Comparison base: `143c1707bdfcd9a9854dfbb49027ade980e01a1e`, from this site's own completed 2026-10-09 reconciliation. Verified that revision in template history and checked the current affected files independently: unchanged foundation instructions, session and middleware matched that base; later customer/module changes were compared separately.
- Strategy: selective base-to-target reconciliation. No ancestry-only merge, reset, wholesale tree/lockfile replacement or unrelated dependency upgrade.
- Status: reconciled with the intentional customer differences below. Use this immutable target as the next comparison point while carrying those differences forward. Deployment and existing unrelated follow-ups are not part of this completion marker.

### Integrated and already present

Added provider-owned maintenance/copywriting guidance and reconciled URL-owned filter guidance. Updated the site sync procedure. Retired only unchanged inherited skill copies removed by the template and their lock entries; preserved customized copies and already-absent skills. The site's pnpm 12.10.1 / Vite+ 1.1.0 toolchain already matched the target; dependency versions, lockfile, customer package identity and Docker wiring are unchanged.

Renamed the installed Login plugin directory to Auth and updated its callers without discarding existing fixes. Added encrypted, expiring, user-owned agent keys; recorded the sign-in method for new sessions; added account/session metadata and revocation with fresh authorization and an impersonation guard. Older sessions remain valid with an unknown method. Account secrets and session controls reject unauthenticated, other-owner and impersonated access.

Generated the site's own additive `20261013131127_profile_security` migration and snapshot, preserving every earlier migration and customer table. It creates `agent_key` with indexes/ownership foreign key and adds nullable `session.sign_in_method`. Better Auth schema generation verified the session field; unrelated schema declarations are preserved. Added only the Security translations for the site's installed locales. Local database startup now applies pending migrations before returning the URL, and db:start uses that resolver. Explicit database URLs retain their existing behavior.

### Intentional differences and local work

Keep the light-only Montserrat public design, company content, public routes, four intranet locales and employee module. The profile adapter matched the comparison base and now uses the target shared AccountPage. The separate uncommitted employee invitation work is excluded from this branch and must be retained when these branches are integrated.

Public content, routes, contacts, locale choices, metadata, assets, fonts, styles, service configuration and storage identities are unchanged. Template sample pages, template release files, template-only migration history and provider registry installation receipts are not customer changes. The registry release was verified as a gate; this is not a general registry rc.4 upgrade.

The original checkout and all its uncommitted changes remain untouched and are not in this sync commit. This sync does not depend on them. Preserve the following work when integrating the branch; overlapping auth hooks must compose the user/invitation hook with the new session hook, not replace either.

```text
M src/intranet/auth/auth.ts
 M src/intranet/auth/functions.ts
 M src/intranet/auth/verification-email.ts
 M src/intranet/components/forge/plugins/employees/employee-actions.tsx
 M src/intranet/components/forge/plugins/employees/employee-create-dialog.tsx
 M src/intranet/components/forge/plugins/employees/index.tsx
 M src/intranet/components/forge/plugins/employees/labels.ts
 M src/intranet/components/forge/plugins/employees/schema.ts
 M src/intranet/components/forge/plugins/employees/server/employees.server.ts
 M src/intranet/e2e/employees.spec.ts
 M src/intranet/e2e/login.spec.ts
 M src/intranet/employees/employees.schema.ts
 M src/intranet/employees/functions.ts
 M src/intranet/i18n/de.json
 M src/intranet/i18n/en.json
 M src/intranet/i18n/fr.json
 M src/intranet/i18n/it.json
 M src/intranet/routes/_auth/$lang/intranet/employees/index.tsx
 M src/intranet/routes/_auth/$lang/reset-password.tsx
?? docs/registry-sync.md
?? docs/registry-sync/
?? src/intranet/e2e/invitations.spec.ts
```

### Environment migration / VPS handoff

Deployed values are unverified; secret-bearing local env files were neither read nor copied. Rebuild the image and recreate the app to deploy this code. These actions have not been executed on a VPS. Keep existing browser VITE_* build arguments: changing them requires a rebuild, and a runtime-only restart is insufficient.

| Variable or setting                                          | Old → new                                                        | Required VPS / local action                                                                                                       | Rebuild, restart and data impact                                                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`                                         | Same required key, now also encrypts stored agent keys           | Retain the existing stable secret; do not rotate it as part of this sync                                                          | Rebuild/recreate app; changing the secret would invalidate sessions and affect stored-key encryption |
| `DATABASE_URL` / migration                                   | Same production URL; additive `20261013131127_profile_security`  | Keep the real production URL; let the existing startup entrypoint apply this migration (or run `vpr db:migrate` before app start) | Rebuild/recreate app; additive schema migration required, no reset or data copy                      |
| Local `DATABASE_URL=exec("node scripts/local-database.mjs")` | Starts database → starts database and applies pending migrations | Development only; retain an explicit URL if already configured and run its migrations explicitly                                  | No VPS env change; local schema migration, existing data/credentials retained                        |
| `PORTLESS_URL`, `VITE_*`                                     | Unchanged                                                        | PORTLESS_URL remains development-only; preserve production origin and analytics build arguments                                   | No new VPS value; changed browser values would require an image rebuild                              |

### Validation and remaining limits

- Frozen dependency installation passed with the destination toolchain; no manifest version or lockfile changes.
- Baseline and final lint/type checks passed; existing warnings remain. Unit tests: 8 passed.
- Agent-safe Varlock validation passed using synthetic local configuration.
- Affected login/profile/security production-build/browser suite: 8 passed, 1 optional Google-provider test skipped. Existing E2E commands owned the build/server lifecycle on port 3100; suites were serialized. External browser requests were blocked and email delivery was faked locally.
- Applied the complete migration chain to a disposable database; local resolver tests passed for automatic migrations, bootstrap credentials, restart/data preservation, no reseeding, failed migration handling and explicit deployment-URL override. Existing local/production volumes were not used.
- Security browser checks covered creation, encryption/metadata secrecy, expiry/deletion, other-owner and anonymous denial, old OAuth sessions, revoking only other owned sessions, impersonation denial, configured locales and mobile/desktop layouts. Reviewed representative screenshots with the site's own styles and supported themes.
- Full `vp check` still reports pre-existing formatting debt in otherwise unchanged files:
  - `MECHANICS.md`
  - `docs/client-migration-report.md`
  - `docs/content-integration-plan.md`
  - `docs/content-recovery-plan.md`
  - `scripts/scrape-soleva-org.mjs`
  - `src/components/layouts/not-found-page.tsx`
  - `src/components/ui/accordion.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/ui/sheet.tsx`
  - `src/lib/data/team.ts`
- Changed files are formatted; full diff review and `git diff --check` passed. Customer public source/assets and existing migration files were verified unchanged.

No live OAuth callback, production email/storage integration, production Docker deployment or production database migration was performed. Optional skipped tests and unrelated prior follow-ups remain outside this sync; no production rollout is claimed.

## Reconciliation — 2026-10-29 (Template RC4)

Status: **source integrated; intranet validated; public rerun and reviews pending**. This is not a deployment claim.

- Source: <https://github.com/the-factory-forge/forge-template>, remotely verified
  `v0.0.0-rc.4`, commit `f0301be5069c8eb69155ce726f22358677f0c35c`.
- Site starting commit: `38d12fae8e623f911883620b7686b39a494cae3b`.
- Review branch: `agent/sync-forge-template-rc4`, stacked on this site's reviewed
  Registry RC6 branch.
- Comparison base: `e43657ee3023805b9f7afb50fa39c28e980476e6` (Template RC2),
  independently recorded in this site's completed 2026-10-13 reconciliation and
  verified as an ancestor of the exact target in canonical Template history.
- Registry remains RC6 `0b47bb77c2f88154eb62a26ce6e08b841bde5e16`. The owner's
  explicit release exceptions cover missing GitHub Release metadata and Registry
  main being above RC6. The frozen Template bundles RC5; this sync preserves
  the site's RC6 source and host fixes. No Registry downgrade is applied.

### Applied and already present

Updated overlapping dependencies to the exact Template target, including pnpm
12.15.0, Vite+ 1.4.0, React 19.3.1, Better Auth 1.7.12 and Drizzle RC5. Customer-only
dependencies remain installed; this site's own lockfile is regenerated. Nitro
traces React/framework dependencies as modules, and the client shares one React
chunk. The inherited Nitro chunk-label adapter is included for the new bundler.

Authentication uses the target factory, appends refreshed cookies without
overwriting existing response cookies, and sends verification back to the
localized login with its email and outcome. Auth schema generation writes a
review candidate under `.cache`; the chained `auth:migrate` shortcut is removed
so host schema reconciliation and migrations remain explicit. `db:push` requires
strict confirmation. Public registration stays disabled.

Soleva gains the migration-journal preflight in Docker and production `start`.
Docker migrates first, then checks; standalone `start` checks without applying
migrations. Pending-password onboarding now stays inside the profile, hiding
module navigation until complete. The historical localized `change-password`
URL redirects into that flow. Profile tabs are URL-owned. Router transitions
participate in the existing loading queue; Auth screens share toast feedback.
Invitation token lookup, automatic sign-in and its manual fallback were already
present and are retained.

Shared primitive cursor/focus behavior, semantic image fallbacks, reduced-motion
service-card interactions and nondeprecated Motion staggering are reconciled.
Deprecated heading/footer props are removed with affected callers adapted to
preserve the existing appearance. Ownership guidance points to the providers.

### Preserved and intentionally different

Public routes, all four locales, project copy and photos/video, Montserrat, the
light-only orange palette, contact/support actions and Leaflet remain site-owned.
Navigation retains its lazy language/mobile chunks. The lightbox now uses the
target's portaled Base UI dialog while preserving responsive thumbnail variants
and its image background. Existing legacy auth redirects remain usable.

Customer migration SQL and historical data are preserved; Template baseline
migrations/snapshots, provider release notes, installation archives and starter
content are not copied. No database reset, live migration, object move, provider
change, secret-file read, publication or deployment is authorized by this update.

### Drizzle RC5 metadata compatibility

The old format-8 snapshots are rejected by Drizzle Kit RC5 before migration.
The official `vp run db up` converted this site's 2 existing snapshots to
format 9. No Template snapshot was copied. All migration SQL files remain byte-identical,
including their SHA-256 hashes. Folder order, snapshot IDs and parent chains are
also unchanged. The official
`drizzle-kit/api-postgres` reconstruction API verified every complete nested DDL
state against the original snapshots; a second `up` changed no bytes. Later
snapshots now store incremental metadata, which explains the large generated
diff. This conversion neither changes the schema nor resets the database.
See the [snapshot conversion proof](template-sync/2026-10-29-rc4/snapshot-format-proof.json).

Fresh migration and explicit journal preflight passed against the site's dedicated
disposable PostgreSQL database. Tests also verified existing accounts, changed
password hashes and sessions across incremental migration, idempotence, and
startup refusal with pending or altered journal entries. Keep the committed
Drizzle RC5 toolchain and converted metadata together; an older CLI cannot use
the new snapshot format.

### VPS environment migration

No environment variable is added, renamed or removed by this Template delta.
Deployed values were not read or verified.

| Variable / behavior                                                       | Before → after                                    | Dokploy action                                                                  | Lifecycle / data impact                                                                                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                            | Same required per-site PostgreSQL URL             | Retain the existing dedicated service, database, role and credentials           | Rebuild/recreate app. Docker applies reviewed pending migrations and then validates the journal; standalone start refuses a stale journal. No reset. |
| `BETTER_AUTH_SECRET`                                                      | Same required stable signing/encryption secret    | Retain it; do not replace it with build placeholders or rotate it for this sync | Rebuild/recreate app; rotating it would affect sessions and stored agent keys.                                                                       |
| `EMAIL_API_KEY`, `EMAIL_FROM`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Same optional runtime providers                   | Preserve values and runtime injection; leave unused providers absent            | Config remains usable when omitted from the image build. Mail/OAuth production delivery is a separate check.                                         |
| `VITE_BASE_URL`, browser `VITE_*` analytics/Ads settings                  | Same public build-time meaning                    | Preserve the confirmed production origin and existing tracking settings         | A changed browser value needs a rebuild; runtime restart alone is insufficient.                                                                      |
| `PORTLESS_URL`, `SITE_NAME` and existing storage routing                  | Same development origin / infrastructure identity | Keep Portless development-only and retain the site's existing identity/prefixes | No storage transfer or deletion.                                                                                                                     |

### Verification

- Exact manifest installation and frozen/offline lockfile verification passed with
  pnpm 12.15.0.
- Lint/type checks passed with 19 pre-existing warnings.
- Unit and disposable-DB tests: 17 passed, with no skipped checks.
- Agent-safe Varlock validation passed with explicit synthetic DB/auth values.
- Changed files are formatted; `git diff --check` passed.
- Customer assets, content dictionaries and styles are byte-identical to the site
  starting commit; Registry RC6 source and the existing review are preserved.

- The coordinator's complete intranet production-browser rerun passed all 16 cases,
  including invitation sessions/fallback, verification, profile tab persistence,
  forced-password onboarding, session cookies, permissions and stored keys.
- The first public run passed 8 of 10 cases. The desktop/mobile photo-viewer
  checks assumed one Escape would dismiss both the focused Close tooltip and
  its dialog. They now verify Base UI's nested-layer behavior: first Escape
  dismisses the tooltip while keeping the dialog; the second closes the dialog
  and restores focus. Focus-trap assertions remain intact; product code is unchanged.

The public browser rerun and both review axes remain pending. No production
deployment or external provider behavior is certified.
