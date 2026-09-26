/** E2E runs may only connect to a disposable local database. */
export const testDatabaseURL =
  process.env.E2E_DATABASE_URL ??
  "postgresql://factory_template_e2e:isolated-local-test-password@localhost:55432/factory_template_e2e";

const target = new URL(testDatabaseURL);
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
  !target.pathname.endsWith("_e2e")
) {
  throw new Error("E2E_DATABASE_URL must target a local database whose name ends in _e2e.");
}
