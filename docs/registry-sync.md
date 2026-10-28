# Registry synchronization

## 2026-10-28: RC6

- Source: `the-factory-forge/forge-registry`, published `v0.0.0-rc.6`.
- Verified source commit: `0b47bb77c2f88154eb62a26ce6e08b841bde5e16`.
  The remote annotated tag peels to that SHA and remote `main` matches it.
- Customer comparison point: `1c4732ce4ab14565b6c0bc3d4feb0baeb43d1ad1`,
  fetched and fast-forwarded from a clean `main` before creating
  `codex/soleva-registry-rc6`.
- Scope: installed Auth, Employees, employees-server, intranet-shell/sidebar,
  cookie banner, newsletter and their required shared UI/helper closure.

The earlier local inventory missed the intranet added to remote `main`.
Actual routes, imports and adapters at the comparison point establish its presence.
This update does not install Blogs, Customers, Mailing, storage, public employee
profiles or another optional application module. Template foundation is unchanged.

### Comparison inputs

[Retained inputs](registry-sync/2026-10-28-rc6/comparison-inputs.json) contain the
pristine public baseline replay, customer source before reconciliation, incoming
post-install source, transformed paths, package manifests, external dependency
locks, hashes and per-file decisions. They contain no secret env files or database
contents. JSON stores the actual text, so a temporary checkout is not required
to recover transformed bytes.

The public baseline replay uses the README's recorded Registry revision
`8846c1ad6ee36b6c5dfaf613ac59184491c8745b` and shadcn `4.21.4`.
The historical installer version was not recorded, so this replay is a retained
comparison input rather than proof of the original installation's exact bytes.
Auth/Employees came through several template reconciliations, most recently
template `e43657ee3023805b9f7afb50fa39c28e980476e6`. No pristine post-install
Registry baseline is proved for that mixed intranet; its bounded current/incoming
behavior was reconciled manually. The template revision is provenance, not a
fabricated pristine Registry installation.

Incoming items were installed with pinned shadcn `4.21.4` in a disposable consumer.
Its entire `@forge` namespace uses the immutable RC6 SHA, including dependencies.
Installed public items remain under `src/components/forge/{layouts,forms}`;
Auth/Employees and shell dependencies remain under `src/intranet/components/forge`.
The shared tooltip lives in the public layer, with the old intranet path retained
as a re-export. Existing host shims and `cn` utilities are reused. The simulated
newsletter example is deliberately excluded.

The installer resolved React Query `5.104.5`; Soleva's compatible pinned `5.104.1`
is retained. Existing Zod `4.5.4` satisfies Employees' `^4.0.0` requirement.
No destination dependency or lockfile refresh is needed. Four-locale labels were
reconciled with existing customer copy and the shared labels already translated
in template RC4; no template runtime code was adopted.

### Host integration and preserved behavior

- Employee creation sends a one-hour, single-use invitation instead of accepting
  an administrator-assigned password. Delivery failure keeps the created account
  available for resend and prevents accidental duplicate creation in the dialog.
  Resending invalidates the previous access link; admin account changes and a
  completed reset invalidate outstanding reset links.
- The host retains fresh administrator checks, self-deletion prevention, disabled
  public signup, existing session/key rules and legacy forced-password onboarding.
  Incoming fake optimistic identities and speculative account edits/deletions are
  omitted to respect the site's server-authoritative mutation convention.
- Employee search/offset live in the URL. Typed Drizzle filters the full directory
  before pagination, with literal `%`, `_` and backslash handling. Search changes
  reset pagination in one host navigation. Background loads retain previous rows
  and disable mutations until the canonical result is available.
- Verification links return to the localized login with recipient and result
  feedback. Search values affect presentation only. The auth provider still
  validates the token; no account is verified from URL parameters.
- Preserve the existing text-only mail transport, four locales, localized routes,
  auth hydration guards and POST form fallback, light-only Montserrat design,
  host themes, the existing `#main-content` skip target, action-specific Ads
  labels and deferred consent controller.
- Cookie consent gains the translated close control without saving draft changes.
  Newsletter remains disabled until a real subscription destination is connected.
  No addresses are collected or sent by the placeholder.

No migration, database reset, storage prefix change or object migration is required.
Existing local and production data were not used for verification. Email settings
remain optional; invitation creation rejects before persistence when delivery is
not configured. Configured delivery failures retain a retryable account.

### Validation

Validation and independent review results are recorded in
[the review record](registry-sync/2026-10-28-rc6/review.md).
All browser tests use production output, a disposable loopback PostgreSQL database,
blocked external requests and a local mail-provider fake. Google and production
delivery/storage remain unverified. Local adoption does not establish deployment.
