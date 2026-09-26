/** Better Auth supports comma-separated role assignments. */
export function isAdmin(role: string | null | undefined): boolean {
  return role?.split(",").includes("admin") ?? false;
}
