import { randomBytes, randomUUID } from "node:crypto";

import { and, eq, like } from "drizzle-orm";
import { ENV } from "varlock/env";

import { db } from "#/intranet/db";
import "@tanstack/react-start/server-only";

import { user as userTable, verification } from "#/intranet/db/schema";
import { localeFromPathname } from "#/lib/i18n/pathname";

import { verificationLoginCallback } from "./verification-callback";

interface AuthEmail {
  user: { id: string; email: string };
  url: string;
}

export function sendVerificationEmail(data: AuthEmail) {
  return sendAuthEmail(
    { ...data, url: verificationLoginCallback(data.url, data.user.email, ENV.VITE_BASE_URL) },
    "employees.verificationSubject",
    "employees.verificationBody",
  );
}

export async function sendPasswordResetEmail(data: AuthEmail) {
  try {
    await sendAuthEmail(data, "auth.resetEmailSubject", "auth.resetEmailBody");
  } catch {
    // Keep the same public response for unknown accounts and delivery failures.
    console.error("Password reset email delivery failed.");
  }
}

export async function sendEmployeeInvitation(user: AuthEmail["user"], invitationURL: string) {
  const token = randomBytes(32).toString("base64url");
  await db.transaction(async (transaction) => {
    const [current] = await transaction
      .select()
      .from(userTable)
      .where(eq(userTable.id, user.id))
      .for("update")
      .limit(1);
    if (!current || current.email !== user.email || current.banned || !current.mustChangePassword)
      throw new Error("This account cannot be invited.");
    await transaction
      .delete(verification)
      .where(
        and(eq(verification.value, user.id), like(verification.identifier, "reset-password:%")),
      );
    await transaction.insert(verification).values({
      id: randomUUID(),
      identifier: `reset-password:${token}`,
      value: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
  });
  const url = new URL(`/api/auth/reset-password/${token}`, ENV.VITE_BASE_URL);
  url.searchParams.set("callbackURL", invitationURL);
  // Public recovery masks delivery failures; administrators need the actual outcome.
  await sendAuthEmail(
    { user, url: url.toString() },
    "employees.invitationSubject",
    "employees.invitationBody",
  );
}

async function sendAuthEmail({ user, url }: AuthEmail, subjectKey: string, bodyKey: string) {
  if (!ENV.EMAIL_API_KEY || !ENV.EMAIL_FROM) throw new Error("Email delivery is not configured.");
  // The auth CLI loads this module without Vite's import.meta.glob transform.
  const { getDictionary, t } = await import("#/lib/i18n");
  const callback = new URL(url).searchParams.get("callbackURL") ?? "/";
  const locale = localeFromPathname(new URL(callback, ENV.VITE_BASE_URL).pathname);
  const dict = await getDictionary(locale);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENV.EMAIL_FROM,
      to: [user.email],
      subject: t(dict, subjectKey),
      text: `${t(dict, bodyKey)}\n\n${url}`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Could not send the authentication email.");
}
