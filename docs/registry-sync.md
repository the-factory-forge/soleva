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
  Activation derives the recipient from the eligible, unexpired token, then uses
  Better Auth to reset the password and sign in. Successful sign-in clears prior
  account caches before the localized login guard selects the destination. If
  only session creation fails, the activated account can log in with its new
  password without retrying a consumed token.
- The host retains fresh administrator checks, self-deletion prevention, disabled
  public signup, existing session/key rules and legacy forced-password onboarding.
  Incoming fake optimistic identities and speculative account edits/deletions are
  omitted to respect the site's server-authoritative mutation convention.
- Employee search/offset live in the URL. Typed Drizzle filters the full directory
  before pagination, with literal `%`, `_` and backslash handling. Search changes
  reset pagination in one host navigation. Background loads retain previous rows
  and disable mutations until the canonical result is available.
  Both search and pagination retain unrelated parameters and the URL fragment
  without resetting scroll. Live typing replaces history, page changes create
  history entries, and clearing search removes its URL parameter.
- Verification links return to the localized login with recipient and result
  feedback. Search values affect presentation only. The auth provider still
  validates the token; no account is verified from URL parameters.
- Preserve the existing text-only mail transport, four locales, localized routes,
  auth hydration guards and POST form fallback, light-only Montserrat design,
  host themes, the existing `#main-content` skip target, action-specific Ads
  labels and deferred consent controller.
  The shared loading bar uses the site's 64px mobile and 80px desktop navbar
  offsets. Pending bulk deletions retain their canonical rows and selection
  until the host confirms each operation.
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

## 2026-10-29: Account mailing

Added only `@forge/mailing` from RC6 `0b47bb77c2f88154eb62a26ce6e08b841bde5e16`
on `agent/brand-transactional-emails`, over the completed Registry/Template sync.
Pinned shadcn 4.21.4 installed the named item into a disposable consumer. Its three
incoming files are retained with destination mappings in
[the installation receipt](registry-sync/2026-10-29-mailing/inputs.json).
They are installed unchanged under `src/intranet/components/forge/plugins/mailing`.
The declared `react-email@6.11.3` dependency and its required peer contexts are
locked; pre-existing package versions and integrity hashes remain unchanged.

Host integration supplies the existing identity and four-locale account copy,
and sends both HTML and plain text through the shared Resend transport. Existing
account/token rules and delivery failure handling remain. The former text-only
mailing exclusion is superseded for this module. No other plugin, environment key,
applied migration, S3 key, production data or public page changes.
See [account email previews](mailing.md). No real mail or deployment was performed.

Fixed point: `d6c5546f0bf90e9f1a098007371279267815fabc`. 29 unit checks passed, including fourteen mailing checks; two unrelated opt-in integration checks skipped. Three built-server invitation/verification/recovery journeys passed. Full `vp check` passed with existing warnings. `vp run preview:mailing` passed and generated all twelve previews without delivery.

## 2026-10-30: RC6 host integration recheck after Template and Mailing

Reviewed `8d3697fa76eb42b51857a48e9fd19bd4520154f1`, the final Mailing stack,
against Registry RC6 `0b47bb77c2f88154eb62a26ce6e08b841bde5e16`.
The Template layer retains all 48 previously installed Forge files byte-for-byte.
The three Mailing files still match their retained incoming installation exactly.
Both migration SQL files remain unchanged. Existing installer inputs cover the
selected items; no reinstall or application change is needed.

| Capability                                               | Host integration                                                                                                                                                                   | Verification and limits                                                                                                         |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Account profile and security                             | The live intranet route supplies `AccountPage` with URL-owned tabs, profile updates/cache invalidation and the host security panel.                                                | Source trace through `routes/_auth/$lang/intranet/index.tsx`; fresh callback and key-schema tests pass.                         |
| Employee administration and invitations                  | The live directory supplies list/search, creation, updates, bans, deletion and resend callbacks. Server functions retain administrator middleware and the shared employee service. | Fresh employee-service tests pass, including non-admin refusal, delivery failure and self-deletion protection.                  |
| Branded invitation, verification and password-reset mail | Auth delivery calls the host formatter and RC6 Resend transport.                                                                                                                   | All 14 mailing checks pass, including the 12 locale/message combinations, unsafe links and provider failure. No email was sent. |

This layer changes documentation only. Optional account email changes and employee
photo/public-profile callbacks remain unconnected, not verified features. Blogs,
Drive and other uninstalled plugins are not activated by this recheck. The selected
scope follows the existing staff access product in `PRODUCT.md`; this receipt does
not claim every optional Registry capability is adopted.

Fresh `vp test --run`: **29 passed, 2 skipped**. Database-gated key storage and
migration checks were not rerun in this documentation-only layer. Runtime,
migrations, assets and dependency files are unchanged from the reviewed SHA;
the built-server journeys recorded above remain prior evidence, not a new
end-to-end run. Production providers and deployment remain unverified.

Fresh `vp check` passes with zero errors and 19 existing warnings.
