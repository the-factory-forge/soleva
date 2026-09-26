import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { ENV } from "varlock/env";
import { z } from "zod";

import { auth } from "#/intranet/auth/auth";
import { authMiddleware, freshAuthMiddleware } from "#/intranet/auth/middleware";
import { _getUser } from "#/intranet/auth/session";
import { db } from "#/intranet/db";
import { user as userTable } from "#/intranet/db/schema";

/**
 * Reports whether auth is enabled (DATABASE_URL + BETTER_AUTH_SECRET set).
 * Showcase sites redirect auth routes to the homepage until authentication is configured.
 */
export const $isAuthEnabled = createServerFn({ method: "GET" }).handler(() => ({
  enabled: auth !== null,
}));

/**
 * Public login capabilities, without exposing any credentials.
 */
export const $getLoginOptions = createServerFn({ method: "GET" }).handler(() => ({
  enabled: auth !== null,
  passwordReset: Boolean(auth && ENV.EMAIL_API_KEY && ENV.EMAIL_FROM),
  google: Boolean(auth && ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET),
}));

/**
 * This server function is meant to be called via authQueryOptions() in queries.ts,
 * which is used by the intranet layout to protect its child routes.
 *
 * For securing server functions or API routes,
 * consider using authMiddleware from middleware.ts instead.
 */
export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await _getUser();
  return user;
});

export const $updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(1).max(200) }))
  .handler(async ({ data }) => {
    if (!auth) throw new Error("Auth not configured");
    await auth.api.updateUser({ headers: getRequest().headers, body: data });
    return _getUser({ disableCookieCache: true });
  });

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8).max(128),
  })
  .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
    message: "Choose a different password",
    path: ["newPassword"],
  });

/**
 * Change the signed-in user's password and clear the `mustChangePassword` flag.
 *
 * Better Auth verifies `currentPassword` against the stored hash and revokes
 * every other session, so a forced password change also signs out any other
 * devices. Used by the first-login flow (admin invites set `mustChangePassword`
 * on the user row) and as a self-service "change my password" action.
 */
export const $changePassword = createServerFn({ method: "POST" })
  .validator(changePasswordSchema)
  .middleware([freshAuthMiddleware])
  .handler(async ({ data, context }) => {
    if (!auth) throw new Error("Auth not configured");

    await auth.api.changePassword({
      headers: getRequest().headers,
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      },
    });

    if (db) {
      await db
        .update(userTable)
        .set({ mustChangePassword: false })
        .where(eq(userTable.id, context.user.id));
    }

    return { ...context.user, mustChangePassword: false };
  });
