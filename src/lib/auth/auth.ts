import "@tanstack/react-start/server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { ENV } from "varlock/env";

import { db } from "#/lib/db";
import * as schema from "#/lib/db/schema";

// Auth is optional: it stays null until BOTH DATABASE_URL and
// BETTER_AUTH_SECRET are configured (see .env.schema). While null, the
// _auth/_guest routes redirect to the homepage and /api/auth returns 404.
export const auth =
  db && ENV.BETTER_AUTH_SECRET
    ? betterAuth({
        baseURL: ENV.VITE_BASE_URL,
        telemetry: {
          enabled: false,
        },
        database: drizzleAdapter(db, {
          provider: "pg",
          schema,
        }),

        // https://better-auth.com/docs/integrations/tanstack#usage-tips
        plugins: [tanstackStartCookies()],

        // https://better-auth.com/docs/concepts/session-management#session-caching
        session: {
          cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
          },
        },

        // https://better-auth.com/docs/concepts/oauth
        socialProviders: {
          ...(ENV.GITHUB_CLIENT_ID && ENV.GITHUB_CLIENT_SECRET
            ? {
                github: {
                  clientId: ENV.GITHUB_CLIENT_ID,
                  clientSecret: ENV.GITHUB_CLIENT_SECRET,
                },
              }
            : {}),
          ...(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET
            ? {
                google: {
                  clientId: ENV.GOOGLE_CLIENT_ID,
                  clientSecret: ENV.GOOGLE_CLIENT_SECRET,
                },
              }
            : {}),
        },

        // https://better-auth.com/docs/authentication/email-password
        emailAndPassword: {
          enabled: true,
        },

        account: {
          additionalFields: {
            // Preserve existing RC-era values; 1.7.3 no longer writes issuer.
            issuer: { type: "string", required: false, input: false },
          },
        },

        advanced: {
          database: {
            // https://better-auth.com/docs/adapters/drizzle#joins
            joins: true,
          },
        },
      })
    : null;
