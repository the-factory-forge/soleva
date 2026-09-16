import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { ENV } from "varlock/env";

import { auth } from "#/lib/auth/auth";

/**
 * Reports whether auth is enabled (DATABASE_URL + BETTER_AUTH_SECRET set).
 * Used by route guards (_guest, _auth) so vitrine sites without a database
 * redirect to the homepage instead of showing the login flow.
 */
export const $isAuthEnabled = createServerFn({ method: "GET" }).handler(() => ({
  enabled: auth !== null,
}));

/**
 * Reports which OAuth providers are configured (env creds present).
 * Login/signup pages render a social button only for configured providers.
 */
export const $getAuthProviders = createServerFn({ method: "GET" }).handler(() => ({
  github: Boolean(ENV.GITHUB_CLIENT_ID && ENV.GITHUB_CLIENT_SECRET),
  google: Boolean(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET),
}));

/**
 * This server function is meant to be called via authQueryOptions() in queries.ts,
 * which is used in the _auth layout route to protect all child routes under it (e.g. _auth/app/*)
 *
 * For securing server functions or API routes,
 * consider using authMiddleware from middleware.ts instead.
 */
export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await _getUser();
  return user;
});

interface GetUserServerQuery {
  disableCookieCache?: boolean | undefined;
  disableRefresh?: boolean | undefined;
}

/**
 * Server-only util, meant to be used by the $getUser server function and auth middleware so logic can be shared with optional query params.
 *
 * For server app logic, consider using authMiddleware instead.
 */
export const _getUser = createServerOnlyFn(async (query?: GetUserServerQuery) => {
  if (!auth) return null;

  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query,
    returnHeaders: true,
  });

  // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  return session.response?.user || null;
});
