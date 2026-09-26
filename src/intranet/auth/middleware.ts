import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

import { isAdmin } from "#/intranet/auth/permissions";
import { _getUser } from "#/intranet/auth/session";

/** Authentication alone, including employees who still need to change their password. */
export const freshAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await _getUser({ disableCookieCache: true });
  if (!user || user.banned) {
    setResponseStatus(401);
    throw new Error("Unauthorized");
  }
  return next({ context: { user } });
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
