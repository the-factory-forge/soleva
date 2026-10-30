import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, eq, gt } from "drizzle-orm";
import { ENV } from "varlock/env";
import { z } from "zod";

import { auth } from "#/intranet/auth/auth";
import { authMiddleware, freshAuthMiddleware } from "#/intranet/auth/middleware";
import { _getUser } from "#/intranet/auth/session";
import { db } from "#/intranet/db";
import { user as userTable, verification } from "#/intranet/db/schema";

/**
 * Public login capabilities, without exposing any credentials.
 */
export const $getLoginOptions = createServerFn({ method: "GET" }).handler(() => ({
  passwordReset: Boolean(ENV.EMAIL_API_KEY && ENV.EMAIL_FROM),
  google: Boolean(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET),
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

// Only an eligible, unexpired invitation token authorizes the recipient lookup.
export const $getInvitationEmail = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(1).max(256) }))
  .handler(async ({ data }) => {
    const [recipient] = await db
      .select({ email: userTable.email, banned: userTable.banned })
      .from(verification)
      .innerJoin(userTable, eq(userTable.id, verification.value))
      .where(
        and(
          eq(verification.identifier, `reset-password:${data.token}`),
          gt(verification.expiresAt, new Date()),
          eq(userTable.mustChangePassword, true),
        ),
      )
      .limit(1);
    return recipient && !recipient.banned ? recipient.email : null;
  });

export const $updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(1).max(200) }))
  .handler(async ({ data }) => {
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
    await auth.api.changePassword({
      headers: getRequest().headers,
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      },
    });

    await db
      .update(userTable)
      .set({ mustChangePassword: false })
      .where(eq(userTable.id, context.user.id));

    return { ...context.user, mustChangePassword: false };
  });
