# Repeatable auth validation

Import `test` and `expect` from `./test` in intranet browser specs. The fixture
assigns a client IP to each test attempt and supplies it to the default browser
context and API request fixture. Repeated runs, retries and parallel workers get
separate identities. Production rate limiting stays enabled: 30 requests per
path in 60 seconds, plus Better Auth's stricter auth endpoint rules.

For another actor, use `clientIP("recipient")` in its `extraHTTPHeaders`.
Independent `browser.newContext` and `playwright.request.newContext` calls do not
inherit the default fixture's headers. Reuse the same label for requests from
the same actor. Some existing specs retain their old test addresses as labels;
the helper now scopes those labels to the test. Do not generate a new identity
for each request or retry a 429 to hide a failed assertion.

The helper changes the IPv6 /64 subnet, not just its final address segment,
because Better Auth groups addresses in the same /64 for rate limiting.

Run the built-server regression repeatedly with:

```sh
vpr test:e2e:intranet rate-limit.spec.ts --workers=2 --repeat-each=3
```

Use a disposable local `E2E_DATABASE_URL` ending in `_e2e` for login and business
journeys. The rate-limit spec uses malformed requests and unknown endpoints; it
requires no accounts or database writes. It verifies cross-test isolation,
shared browser/API limits, the stricter login limit and the generic limit.

## Proxy/IP handling is a separate concern

The installed Better Auth versions accept a valid single `x-forwarded-for` IP
by default. Missing or malformed IPs and forwarded chains without configured
trusted hops share a conservative per-path fallback bucket. The regression
exercises that behavior separately. Giving tests identities fixes test state
sharing; it does not establish the live proxy's configuration or prove that
historic login timing failures were caused by rate limiting.

At deployment, verify the actual ingress behavior: the origin must be reachable
only through the trusted proxy, which must overwrite or sanitize client-supplied
IP headers. Have it provide one verified client IP in `x-forwarded-for`. If the
infrastructure instead supplies another authoritative header or a proxy chain,
configure `advanced.ipAddress.ipAddressHeaders` or exact `trustedProxies` in the
host's auth config after verifying that topology. Do not guess broad private
ranges, trust arbitrary browser headers at an exposed origin, disable IP
tracking, or raise the production limits to silence the warning.

See [Better Auth's IP and rate-limit guidance](https://better-auth.com/docs/concepts/rate-limit).
No live ingress inspection or production proxy configuration change is included
in this test-isolation fix.
