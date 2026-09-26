import "@tanstack/react-start/server-only";
import { ENV } from "varlock/env";

import { getDictionary, t } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";

interface AuthEmail {
  user: { email: string };
  url: string;
}

export function sendVerificationEmail(data: AuthEmail) {
  return sendAuthEmail(data, "employees.verificationSubject", "employees.verificationBody");
}

export async function sendPasswordResetEmail(data: AuthEmail) {
  try {
    await sendAuthEmail(data, "auth.resetEmailSubject", "auth.resetEmailBody");
  } catch {
    // Keep the same public response for unknown accounts and delivery failures.
    console.error("Password reset email delivery failed.");
  }
}

async function sendAuthEmail({ user, url }: AuthEmail, subjectKey: string, bodyKey: string) {
  if (!ENV.EMAIL_API_KEY || !ENV.EMAIL_FROM) throw new Error("Email delivery is not configured.");
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
