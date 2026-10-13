import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

import { isAdmin } from "#/intranet/auth/permissions";
import { _getSession } from "#/intranet/auth/session";

/** Authentication alone, including employees who still need to change their password. */
export const freshAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await _getSession({ disableCookieCache: true });
  if (!session) {
    setResponseStatus(401);
    throw new Error("Unauthorized");
  }
  return next({ context: { user: session.user, session: session.session } });
});

/** Use for protected server functions, including modules installed from the registry. */
export const authMiddleware = createMiddleware()
  .middleware([freshAuthMiddleware])
  .server(({ next, context }) => {
    if (context.user.mustChangePassword) {
      setResponseStatus(403);
      throw new Error("Change your password before continuing.");
    }
    return next({ context });
  });

export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(({ next, context }) => {
    if (!isAdmin(context.user.role)) {
      setResponseStatus(403);
      throw new Error("Administrator access required.");
    }
    return next({ context });
  });

/** Account secrets and session controls are never available during impersonation. */
export const accountSecurityMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(({ next, context }) => {
    if (context.session.impersonatedBy) {
      setResponseStatus(403);
      throw new Error("End impersonation to manage your account security.");
    }
    return next({ context });
  });
