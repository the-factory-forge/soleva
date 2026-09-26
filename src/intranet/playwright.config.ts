import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

import publicConfig, { webServer } from "../../playwright.config";
import { testDatabaseURL } from "./e2e/database";

export default defineConfig({
  ...publicConfig,
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  testDir: "./e2e",
  outputDir: "../../.cache/playwright-intranet",
  webServer: {
    ...webServer,
    cwd: fileURLToPath(new URL("../../", import.meta.url)),
    command:
      "DATABASE_URL= BETTER_AUTH_SECRET= EMAIL_API_KEY= EMAIL_FROM= GOOGLE_CLIENT_ID= GOOGLE_CLIENT_SECRET= vp run build && NODE_OPTIONS='--import=./src/intranet/e2e/resend-fake.mjs' vp run start:e2e",
    env: {
      ...webServer.env,
      BETTER_AUTH_SECRET: randomBytes(32).toString("base64url"),
      DATABASE_URL: testDatabaseURL,
      GOOGLE_CLIENT_ID: process.env.E2E_GOOGLE === "1" ? "local-e2e-google-client" : "",
      GOOGLE_CLIENT_SECRET: process.env.E2E_GOOGLE === "1" ? "local-e2e-google-secret" : "",
      EMAIL_API_KEY: "e2e-email-key",
      EMAIL_FROM: "Example <accounts@example.test>",
    },
  },
});
