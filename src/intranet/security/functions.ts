import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";

import { auth } from "#/intranet/auth/auth";
import { accountSecurityMiddleware } from "#/intranet/auth/middleware";
import { db } from "#/intranet/db";
import { agentKey, session } from "#/intranet/db/schema";

import { agentKeySchema } from "./key.schema";
import { createAgentKey } from "./keys.server";

export const $getAccountSecurity = createServerFn({ method: "GET" })
  .middleware([accountSecurityMiddleware])
  .handler(async ({ context }) => {
    setResponseHeader("Cache-Control", "no-store");
    const headers = getRequest().headers;
    const [accounts, sessions] = await Promise.all([
      auth.api.listUserAccounts({ headers }),
      // Better Auth's listSessions requires a recent login; this view only needs owned metadata.
      db
        .select({
          id: session.id,
          userAgent: session.userAgent,
          ipAddress: session.ipAddress,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
        })
        .from(session)
        .where(and(eq(session.userId, context.user.id), gt(session.expiresAt, new Date())))
        .orderBy(desc(session.createdAt)),
    ]);
    return {
      signInMethod: context.session.signInMethod ?? null,
      providers: [...new Set(accounts.map((account) => account.providerId))],
      sessions: sessions.map((session) => ({
        id: session.id,
        current: session.id === context.session.id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      })),
    };
  });

export const $revokeOtherSession = createServerFn({ method: "POST" })
  .middleware([accountSecurityMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    setResponseHeader("Cache-Control", "no-store");
    const headers = getRequest().headers;
    if (context.session.id === data.id) {
      setResponseStatus(400);
      throw new Error("You cannot sign out this session here.");
    }
    const [target] = await db
      .select({ token: session.token })
      .from(session)
      .where(
        and(
          eq(session.userId, context.user.id),
          eq(session.id, data.id),
          gt(session.expiresAt, new Date()),
        ),
      )
      .limit(1);
    if (!target) {
      setResponseStatus(404);
      throw new Error("Session not found. Refresh the page and try again.");
    }
    await auth.api.revokeSession({ headers, body: { token: target.token } });
    return { success: true };
  });

export const $listAgentKeys = createServerFn({ method: "GET" })
  .middleware([accountSecurityMiddleware])
  .handler(async ({ context }) => {
    setResponseHeader("Cache-Control", "no-store");
    return db
      .select({
        id: agentKey.id,
        name: agentKey.name,
        createdAt: agentKey.createdAt,
        lastUsedAt: agentKey.lastUsedAt,
        expired: sql<boolean>`${agentKey.expiresAt} <= now()`,
        expiresAt: agentKey.expiresAt,
      })
      .from(agentKey)
      .where(eq(agentKey.userId, context.user.id))
      .orderBy(desc(agentKey.createdAt));
  });

export const $createAgentKey = createServerFn({ method: "POST" })
  .middleware([accountSecurityMiddleware])
  .validator(agentKeySchema)
  .handler(async ({ context, data }) => {
    setResponseHeader("Cache-Control", "no-store");
    return createAgentKey(context.user.id, data);
  });

export const $deleteAgentKey = createServerFn({ method: "POST" })
  .middleware([accountSecurityMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    setResponseHeader("Cache-Control", "no-store");
    const [deleted] = await db
      .delete(agentKey)
      .where(and(eq(agentKey.id, data.id), eq(agentKey.userId, context.user.id)))
      .returning({ id: agentKey.id });
    if (!deleted) {
      setResponseStatus(404);
      throw new Error("Agent key not found");
    }
    return deleted;
  });
