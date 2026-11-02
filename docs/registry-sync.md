# Soleva Registry reconciliation — 2026-11-01

Template `v0.0.0-rc.6` (`174808be9038b3d14a61634c86509f45074bbb94`) was reconciled and verified before the installed Registry source was reviewed against `v0.0.0-rc.8` (`5ffb422ce0034a77837d76e0035567a0f3d38968`). The coordinator verified both published annotated tags against canonical remote main. See [the template report](../.agents/configs/.sync-template/report.html) for customer decisions and preserved historical reports.

## Scope and retained comparison

A real shadcn 4.23.0 install of 53 named items ran successfully in an independent consumer using the exact Registry SHA namespace. The final [mapping](registry-sync/2026-11-01-rc8/item-mapping.json) has 85 provider-file entries, including public and intranet shim destinations. Selected items: `table-styles`, `dialog-submit`, `loading-indicator`, `icon-tooltip`, `native-select`, `table-pagination`, `table-selection`, `table-search`, `section-variants`, `build-metadata`, `json-ld`, `social-icons`, `accordion`, `animations`, `reveal`, `share-button`, `section-heading`, `image-with-fallback`, `lightbox`, `cta-button`, `breadcrumb`, `dropdown-menu`, `sheet`, `ui-shims`, `newsletter`, `cookie-banner`, `language-switcher`, `navbar`, `manage-cookies-button`, `footer`, `page-home-hero`, `page-hero`, `page-cta-band`, `service-card`, `page-services-grid`, `page-faq-list`, `page-pricing-table`, `page-contact-info`, `page-legal`, `page-not-found`, `footer-helpers`, `sidebar-navigation`, `intranet-sidebar`, `auth`, `employees`, `employees-server`, `consent-analytics`, `action-toast`, `optimistic-action`, `image-crop`, `database`, `cn`, `intranet-shell`.

This scope is public components and the existing Auth/Employees integration. The database item is bounded to the existing migration-history helper; the generic database wrapper is not installed into Soleva. Utility dependencies for icons/storage filenames do not install business, Drive, Blogs or Agents plugins. Existing account API-key controls remain part of the installed Auth integration. No optional plugin was enabled.

The pristine historical Registry installation is unknown/mixed. Historical revision notes were retained as provenance, not asserted as a reproducible base. Manual source and caller review used the actual post-Template host state, actual RC8 installation, required stylesheet/dependency effects and host wrapper inputs. The [comparison archive](registry-sync/2026-11-01-rc8/comparison-inputs.tar.gz) and [653 verified hashes](registry-sync/2026-11-01-rc8/checksums.json) retain those inputs, mappings, install command/output, Template comparison and verification logs.

## Applied behavior and customer decisions

- Public source adopts semantic figures, keyboard/focus-trapped image previews, reduced-motion handling, contextual close tooltips, pointer affordances, labeled newsletter fields and current generic section APIs. Motion uses its current stagger API. The optional HomeHero priority and responsive image sources remain. Four active SectionHeading callers use the explicit secondary variant, preserving their prior contrast.
- Cookie close is localized and dismisses without storing consent. All four locales can reopen preferences. The existing privacy path `/{locale}/confidentialite`, consent key/event, delayed mounting and per-action Ads conversion labels remain. The coming-soon newsletter stays disabled and does not send/store an email.
- Soleva's active public layouts, content, assets, light-only Montserrat/orange presentation, footer-only login and custom embedded intranet Navbar remain. The generic copied sections are maintained without replacing the active customer wrappers. Existing secondary link contrast and rounded shapes remain.
- The public navigation keeps its lazy Base UI boundary; its mobile trigger and footer social icons use native titles alongside accessible names. A static tooltip import there would undo the documented first-paint split. The shared gallery/Sheet/cookie controls use the current tooltip primitive where it is already in the deferred graph.
- Inline dictionaries, host router/image shims, responsive image sources, LazyMotion with semantic `as`, actual metadata/OG handling, contrast tokens and customer footer credit remain. Existing public `cn` and intranet `cnfast` adapters retain their local consumers. Leaflet and its SSR optimization remain.
- Auth/Employees modules already received current behavior through the preceding Template reconciliation. Comparison with actual RC8 installed modules confirmed matching logic after host path/import/format adaptation. Current hydration-safe POST forms, invitation lifecycle, live authorization checks, transactional employee actions, password gating and encrypted API-key/session controls are retained and exercised. No duplicate generic DB instance was added.

## Data and deployment boundary

The September fresh-schema reset was a historical owner decision; it is not repeated or authorized by this sync. Both existing migration SQL files are byte-identical. Drizzle's required snapshot metadata upgrade preserves original IDs and parent chains; [the preservation record](registry-sync/2026-11-01-rc8/migration-preservation.json) records hashes. Migration and startup-preflight tests used only an owned disposable PostgreSQL container and test-created databases. No VPS or customer database was accessed.

Auth is installed and requires DATABASE_URL and BETTER_AUTH_SECRET. README now describes the current required contract. Auth generation writes a review candidate under `.cache`; the old combined generation/migration command is removed. Docker performs incremental migrations then preflight; normal `vpr start` performs preflight without applying migrations. No new SQL migration or env key is introduced here.

| Environment/operation | Change and mapping | Next release action | Rebuild/restart | Data migration |
| --- | --- | --- | --- | --- |
| VITE_BASE_URL and existing GA/Ads IDs plus per-action labels | Unchanged; public origin and consent-gated analytics | Preserve confirmed production settings; live values were not inspected | Normal rebuild/restart | None |
| DATABASE_URL | Required existing intranet database | Keep existing DB and data; inspect current migration history before rollout | Normal restart; new preflight must pass | No new SQL from this sync; only already-reviewed pending history may run through normal deploy |
| BETTER_AUTH_SECRET | Required existing signing and API-key encryption key | Preserve value; do not rotate as part of source sync | Normal restart | None |
| GOOGLE_CLIENT_ID/SECRET, EMAIL_API_KEY/FROM | Existing optional Google and invitation/reset delivery settings; GitHub remains disabled | Preserve enabled integrations; tests used fake local transport only | Normal rebuild/restart as configured | None |
| SITE_NAME / Portless | Existing container identity/local origin mapping | Preserve production identity; isolated test resources are removed | Normal release | None |
| Runtime/tooling | Template-pinned packages, pnpm 12.16.1; Leaflet retained | Rebuild and deploy through the usual next release; no deployment performed | Required normal rebuild/restart | Snapshot metadata only; migration SQL unchanged |

## Checks and limits

Template phase: lint/typecheck passed, 13 unit/integration tests passed, 10 public production browser tests passed, and 22 intranet tests passed with the configured-Google-only case initially skipped. Final Registry phase: lint/typecheck passed with 18 existing warnings (initial baseline: 30), all 13 unit/integration tests passed, all 10 public production browser tests passed, and all 23 intranet tests passed with local fake Google enabled. These include all four locales, small-screen navigation, no-consent close/reopen, image-preview tooltip/focus/Escape handling, disabled newsletter, no-JavaScript auth forms, invitation/employee failure-and-retry paths, password changes, authorization, encrypted keys and session revocation.

Frozen pnpm installation, safe auth schema preview generation and Varlock validation passed with synthetic env values. The auth CLI emits an existing `--y` deprecation warning; generation succeeds and does not overwrite the active schema. Startup tests reject stale migration history and preserve populated accounts through incremental migrations. Mobile navigation, cookie controls and login screenshots were visually reviewed. Unmounted portable sections received source/type review; no broad rendered-page equivalence is claimed. Browser builds emit the existing Sass import warning and local unresolved-IP fail-closed warning. No unresolved source blocker remains, and production secrets/proxy/database state were not verified.

### Coordinator localization check

Final coordinator review added only common.close in all four public dictionaries, reusing the existing nav.close translations. Auth and intranet toast dismissal now receives localized text while every existing dictionary value remains unchanged. The real shallow dictionary merge/callers, full type-aware lint (18 existing warnings) and formatting were checked in a separate review worktree.

## Soleva account mailing follow-up

This focused follow-up starts at `45be5d8ed908d0dea2b8c7f3d754a019a6b87c0b`,
after the Template RC6 and Registry RC8 reconciliation above. It connects the
existing invitation, verification and password-recovery senders to branded HTML
and matching plain text. Current recipients, token transaction/expiry/replacement,
callback locales, fresh account restrictions and neutral public reset errors stay
host-owned. No auth route, database, migration, environment key or public asset changes.

The three Mailing files match the generated published Registry RC8 item at
`5ffb422ce0034a77837d76e0035567a0f3d38968` byte-for-byte. The previously reviewed
Mailing source is unchanged between RC6 and RC8; this follow-up adopts the exact
RC8 files rather than restoring the older foundation branch. SHA-256:

- `index.ts`: `9e9a9038a6a030275d240c94f085b39f2d1bba47a605fc554f9990cec90a7bd3`
- `transactional-email.tsx`: `3bf6a431131f4213fb8df320625a247dbe26e82546753c673491e7bbb83c5ddf`
- `resend.server.ts`: `b47c45dba322365b46a6ee675cc839678b33ca98bee3bd8e4518bd1da8b273d6`

Only its declared `react-email@6.11.3` dependency is added. All 774 pre-existing
lockfile package records, including their versions and integrity metadata, remain
unchanged. The site adapter uses its existing PNG logo, light palette, orange
`#ff803e`, Montserrat with system fallbacks, and current French, English, German
and Italian copy. Live logos need the configured public HTTPS origin.

`vp run preview:mailing` renders twelve HTML/text pairs to `.cache/mailing/`
using synthetic URLs and credentials, without delivery or a database. Open an
HTML file directly; only its preview logo uses a local copied PNG.

The fourteen renderer/transport checks pass without network delivery. The complete
unit suite passes 25 tests with 2 existing database-gated skips. Type-aware lint
and type checking pass with 18 existing warnings. Built-server
invitation, verification and password-reset checks are extended to assert actual
branded HTML and matching usable text links; their final runtime result is pending
the coordinator's isolated local run. Production delivery remains unverified.
