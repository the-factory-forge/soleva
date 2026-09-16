import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  outputDir: ".cache/playwright",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "vp run build && vp run start:e2e",
    env: {
      NODE_ENV: "production",
      PORT: "3100",
      VITE_BASE_URL: baseURL,
      DATABASE_URL: "",
      BETTER_AUTH_SECRET: "",
      GITHUB_CLIENT_ID: "",
      GITHUB_CLIENT_SECRET: "",
      GOOGLE_CLIENT_ID: "",
      GOOGLE_CLIENT_SECRET: "",
      // Synthetic IDs exercise consent; tests block all external requests.
      VITE_GA_MEASUREMENT_ID: "G-SOLEVA-TEST",
      VITE_GOOGLE_ADS_ID: "AW-SOLEVA-TEST",
      VITE_ADS_CONVERSION_LABEL: "",
      VITE_ADS_PHONE_LABEL: "",
      VITE_ADS_MAIL_LABEL: "",
    },
    url: baseURL,
    reuseExistingServer: false,
    gracefulShutdown: { signal: "SIGTERM", timeout: 500 },
    timeout: 120_000,
  },
});
