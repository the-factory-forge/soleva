# Profile security

`/{locale}/intranet` → Security is self-service for the authenticated account.
It supports named agent keys, explicit expiry (future, at most 90 days), deletion,
Created/Last used/Expires metadata and Active/Expired statuses. The key secret is
shown only after creation; the list returns metadata only. Sign-in methods and
other active sessions appear below, with a sign-out action per other session.
French, English, German and Italian use the host dictionaries.

## Storage and authorization

Apply the incremental `20261013131127_profile_security` migration before running
this version. It adds `agent_key` and nullable `session.sign_in_method` without
replacing baseline history or changing existing accounts. Docker applies pending
migrations through its existing startup procedure. A sync is not a production
migration or deployment.

Keys contain 32 random bytes. The database stores a SHA-256 verifier and an
authenticated encrypted copy using Better Auth's `symmetricEncrypt` with the
host `BETTER_AUTH_SECRET` and an `:agent-keys` context. Neither stored form is
returned by list operations. Keep that secret stable; rotation requires a plan
for stored ciphertext as well as existing auth sessions. There is deliberately
no key-reveal endpoint. Closing the creation result clears the secret; it is not
saved in browser storage, logs or a persistent Query cache.

All Security RPCs require an authoritative database-backed session, completed
first-login onboarding and no impersonation. Lists and destructive operations
are scoped to that account; IDs supplied by a browser never establish ownership.
The current session cannot be revoked through the other-session action.

The template has no customer/project import endpoint. These are site-local
integration credentials, not TC import tokens and not browser login tokens.
Modules that support agent access can call
`src/intranet/security/keys.server.ts:authenticateAgentKey` with a bearer token.
The helper rejects deleted/expired keys, banned users and pending password
changes, records successful authentication as Last used and returns the current
user ID/role. Each endpoint must still enforce its own current resource permissions,
request validation and rate limits. No template endpoint accepts these keys by
default; creating one does not grant access to employee administration or install
a business module. Last used remains Never until an integration verifies the key.

## Sign-in and sessions

The Better Auth session-create hook records email/password or OAuth callback
provenance. Older sessions retain an unknown method until the next login; a linked
provider is not proof of which method created a session. Google remains the
configured template OAuth option; existing provider IDs such as GitHub can be
displayed without adding a GitHub login integration.

Credential accounts retain the existing change-password form and may request
reset emails when the host's email integration is configured. OAuth-only accounts
show neither password control. Password reset uses the existing localized route,
email transport and Better Auth session-revocation behavior.

Better Auth's native `listSessions` rejects otherwise-valid logins older than its
fresh-login window. This page instead selects only the owner's unexpired session
metadata after authoritative middleware. It never sends session tokens to the
browser and never disables Better Auth's global freshness checks. Revocation
resolves an owned session ID on the server and calls Better Auth with its token.

See [the sync record](../.sync-template/report.html#history) for this site’s exact migration and validation.
