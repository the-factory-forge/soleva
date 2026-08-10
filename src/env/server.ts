import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  // Docker sets ENV vars to "" when a build ARG is not provided - treat
  // empty string as unset so defaults apply instead of failing validation.
  emptyStringAsUndefined: true,
  server: {
    // Optional: showcase sites run without a database (auth disabled until set).
    // Empty string = unset (the .env.example ships DATABASE_URL=).
    DATABASE_URL: z.union([z.url(), z.literal("")]).optional(),
    VITE_BASE_URL: z.url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().optional(),

    // OAuth2 providers, optional, update as needed
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },
  runtimeEnv: process.env,
});
