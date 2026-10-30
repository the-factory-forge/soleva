# RC6 review

Comparison point: `1c4732ce4ab14565b6c0bc3d4feb0baeb43d1ad1`.

## Verification

- Frozen dependency installation: passed.
- Lint and TypeScript: passed; 30 existing repository warnings remain.
- Unit tests: 12 passed, one existing database-gated integration test skipped.
- Public production browser journeys: six passed, covering consent persistence,
  cancel/reopen/analytics withdrawal, localized navigation, disabled newsletter,
  customer branding, mobile/desktop and intranet entry.
- Intranet production browser journeys: 12 distinct tests passed across the
  initial run and targeted reruns; one configured-Google-provider test skipped.
  Includes one-hour/single-use invitation activation, stale-link resend rejection,
  delivery failure/retry, email verification and recipient-prefilled login,
  edit/delete authorization, account/session removal, whole-directory literal
  search before pagination, URL reload/Back/Forward, bulk deletion, legacy password
  onboarding, profile/security/session/key controls and four-locale mobile login.
- Reviewed production screenshots of mobile consent/newsletter and employee
  directory layouts. No horizontal document overflow on the employee journey.
- The disposable PostgreSQL container was removed after verification.
- Parent pre-review found incomplete preservation of URL state in the new
  Employees callbacks. Fixed functional search updates, retained unrelated
  parameters and fragments, disabled scroll reset, removed cleared filters and
  kept pagination history while replacing live typing. The targeted production
  browser regression passed on another disposable database with
  `panel=retained#team`, reload, Back/Forward, cleared search and bulk deletion.
- Full `vp check` detects pre-existing formatting debt outside this change;
  modified-file formatting and `git diff --check` are required separately.

## Standards

An independent read-only sub-agent reviewed `1c4732c...a35a335` against the
documented standards and the full Fowler smell baseline.

One P2 finding: the incoming bulk-deletion helper exposes an optimistic deletion
flag and Employees used it to hide a row before server confirmation. This
contradicted `.agents/data-flow.md`'s prohibition on optimistic destructive or
security-sensitive mutations. Resolved in the Employees consumer: pending rows
stay visible and controls remain disabled until the existing host callback
refreshes canonical data. The shared helper's selection/retry behavior is intact.

The regression holds the real deletion request at the HTTP boundary and verifies
both rows remain visible until release, then checks both records were removed.
No additional material standards violation or justified Fowler smell was found.

## Spec

An independent read-only sub-agent reviewed the same fixed diff against the sync
request, canonical `sync-from-forge-registry` skill, RC6 Auth/Employees/consent
guides and shared Registry distribution/host/UI contracts.

Two findings, both resolved:

1. P2: invitation acceptance did not sign in automatically, as required by RC6
   `docs/intranet-auth.md:326-331`. Added the existing Forge host pattern: derive
   the recipient only from an eligible, unexpired token; call Better Auth reset
   and sign-in; clear previous-account caches before navigation. Session failure
   preserves activation success and the login fallback. Browser tests prove
   automatic access, the correct recipient, stale-token rejection and recovery
   after a deliberately failed sign-in.
2. P3: the shared loading bar retained its default `top-0` instead of sitting
   below the navbar, contrary to `shared-ui/spec.md`'s shared loading requirement.
   The host now supplies responsive offsets. Computed positions were verified at
   80px desktop and 64px mobile in the production browser test.

The affected invitation, recovery, directory/bulk and fallback journeys passed
across targeted reruns after these changes. Initial fixture selectors were
adapted to the real pending label, and each test uses an independent synthetic
client IP to avoid coupling through provider rate limits.

Final unresolved findings: Standards 0, Spec 0. Initial findings were Standards 1
with maximum P2, and Spec 2 with maximum P2. Parent review remains separate.

`docs/agents/issue-tracker.md` is absent; `/setup-matt-pocock-skills` can configure
that optional issue-tracker workflow. No originating external issue is required
to identify the supplied sync contract.

## Independent coordinator review

Two further read-only reviewers compared the fixed base with
`ef9eb05d9c3fdf5d7eb09dcbee49f0744060fdfe` after the implementation review.
Standards found one P3: the verification status was a focusable button without an
action, contrary to the shared UI status contract. It now renders as a
non-interactive image status with a translated accessible name and title. Its
semantic colors and verification value are unchanged; the unused tooltip import
was removed. Lint/types pass after this markup correction. No additional browser
run was needed for the native element replacement.

Spec found zero actionable issues. The connected invitation, mutation and URL
flows were reviewed independently; all 222 retained text hashes and 100 original
customer entries match their recorded inputs and starting commit. Both axes have
zero unresolved findings. The same published RC6 status issue is recorded as an
upstream follow-up; the Registry working tree was not changed.

## Review focus

1. Host invitation transport and auth reset hooks.
2. Typed server search and URL/cache integration.
3. Employee permissions, delivery failure/retry and self-deletion guards.
4. Preserved public consent/newsletter integrations and four-locale labels.

No push, deployment, production email or production migration was performed.
