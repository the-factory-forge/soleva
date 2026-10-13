import "@tanstack/react-start/server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";

import { symmetricEncrypt } from "better-auth/crypto";
import { and, eq, gt, or, isNull, lte } from "drizzle-orm";
import { ENV } from "varlock/env";

import { db } from "#/intranet/db";
import { agentKey, user } from "#/intranet/db/schema";

import { agentKeySchema } from "./key.schema";

export function hashAgentKey(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAgentKey(userId: string, input: unknown) {
  const data = agentKeySchema.parse(input);
  const token = `forge_key_${randomBytes(32).toString("base64url")}`;
  await db.insert(agentKey).values({
    ...data,
    id: randomUUID(),
    userId,
    tokenHash: hashAgentKey(token),
    encryptedToken: await symmetricEncrypt({
      key: `${ENV.BETTER_AUTH_SECRET}:agent-keys`,
      data: token,
    }),
  });
  return { token };
}

/** Identity only: module endpoints must also enforce their own current permissions. */
export async function authenticateAgentKey(token: string) {
  if (!/^forge_key_[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("Invalid or expired agent key");
  const now = new Date();
  const [owner] = await db
    .update(agentKey)
    .set({ lastUsedAt: now })
    .from(user)
    .where(
      and(
        eq(agentKey.tokenHash, hashAgentKey(token)),
        gt(agentKey.expiresAt, now),
        eq(agentKey.userId, user.id),
        or(eq(user.banned, false), isNull(user.banned), lte(user.banExpires, now)),
        or(eq(user.mustChangePassword, false), isNull(user.mustChangePassword)),
      ),
    )
    .returning({ id: user.id, role: user.role });
  if (!owner) throw new Error("Invalid or expired agent key");
  return owner;
}
