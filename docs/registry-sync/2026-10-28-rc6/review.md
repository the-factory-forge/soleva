# RC6 review

Comparison point: `1c4732ce4ab14565b6c0bc3d4feb0baeb43d1ad1`.

## Verification

- Frozen dependency installation: passed.
- Lint and TypeScript: passed; 30 existing repository warnings remain.
- Unit tests: 12 passed, one existing database-gated integration test skipped.
- Public production browser journeys: six passed, covering consent persistence,
  cancel/reopen/analytics withdrawal, localized navigation, disabled newsletter,
  customer branding, mobile/desktop and intranet entry.
- Intranet production browser journeys: 11 distinct tests passed across the
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

Independent two-axis review pending.

## Spec

Independent two-axis review pending. The specification source is the sync request,
the canonical `sync-from-forge-registry` skill, Registry RC6 Auth/Employees/consent
guides and the shared Registry distribution/host/UI contracts.

`docs/agents/issue-tracker.md` is absent; `/setup-matt-pocock-skills` can configure
that optional issue-tracker workflow. No originating external issue is required
to identify the supplied sync contract.

## Review focus

1. Host invitation transport and auth reset hooks.
2. Typed server search and URL/cache integration.
3. Employee permissions, delivery failure/retry and self-deletion guards.
4. Preserved public consent/newsletter integrations and four-locale labels.

No push, deployment, production email or production migration was performed.
