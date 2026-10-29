import { localeFromPathname } from "#/lib/i18n/pathname";

export function verificationLoginCallback(verificationURL: string, email: string, origin: string) {
  const url = new URL(verificationURL);
  const requested = new URL(url.searchParams.get("callbackURL") ?? "/", origin);
  const locale = localeFromPathname(requested.pathname);
  const callback = new URL(`/${locale}/login`, origin);
  callback.searchParams.set("email", email);
  callback.searchParams.set("verified", "true");
  url.searchParams.set("callbackURL", callback.toString());
  return url.toString();
}
