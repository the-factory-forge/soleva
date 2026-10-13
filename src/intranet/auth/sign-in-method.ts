export function sessionSignInMethod(path?: string, providerId?: string) {
  if (path === "/sign-in/email" || path === "/sign-up/email") return "credential";
  if (path?.startsWith("/callback/")) return providerId ?? path.split("/").pop() ?? null;
  return null;
}
