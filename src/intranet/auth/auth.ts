import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import "@tanstack/react-start/server-only";
import { APIError, createAuthMiddleware, getAuthoritativeSessionFromCtx } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { admin as adminPlugin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";
import { ENV } from "varlock/env";

import { db } from "#/intranet/db";
import * as schema from "#/intranet/db/schema";

import { sendPasswordResetEmail, sendVerificationEmail } from "./verification-email";

// Auth is optional: it stays null until BOTH DATABASE_URL and
// BETTER_AUTH_SECRET are configured (see .env.schema). While null, the
// _auth routes redirect to the homepage and /api/auth returns 404.
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
        plugins: [
          adminPlugin(),

          tanstackStartCookies(),
        ],

        user: {
          additionalFields: {
            mustChangePassword: {
              type: "boolean",
              defaultValue: false,
              required: false,
              input: false,
            },
          },
        },

        // Also protect native admin endpoints during first-login onboarding.
        hooks: {
          before: createAuthMiddleware(async (ctx) => {
            if (!ctx.path.startsWith("/admin/")) return;
            const session = await getAuthoritativeSessionFromCtx(ctx);
            if (session?.user.mustChangePassword) {
              throw new APIError("FORBIDDEN", {
                message: "Change your password before continuing.",
              });
            }
          }),
        },

        // https://better-auth.com/docs/concepts/oauth
        socialProviders: {
          ...(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET
            ? {
                google: {
                  clientId: ENV.GOOGLE_CLIENT_ID,
                  clientSecret: ENV.GOOGLE_CLIENT_SECRET,
                  disableSignUp: true,
                },
              }
            : {}),
        },

        emailVerification: {
          sendVerificationEmail,
          sendOnSignUp: false,
          sendOnSignIn: false,
        },

        // https://better-auth.com/docs/authentication/email-password
        emailAndPassword: {
          enabled: true,
          // Intranet: no public self-registration. Users (and their roles) are
          // provisioned by an admin. Migrations bootstrap an empty user table.
          disableSignUp: true,
          ...(ENV.EMAIL_API_KEY && ENV.EMAIL_FROM
            ? { sendResetPassword: sendPasswordResetEmail }
            : {}),
          revokeSessionsOnPasswordReset: true,
          onPasswordReset: async ({ user }) => {
            if (!db) throw new Error("Database not configured");
            await db
              .update(schema.user)
              .set({ mustChangePassword: false })
              .where(eq(schema.user.id, user.id));
          },
        },

        // https://better-auth.com/docs/concepts/rate-limit
        rateLimit: {
          enabled: true,
          window: 60, // seconds
          max: 30, // max requests per window per IP
        },

        advanced: {
          database: {
            // https://better-auth.com/docs/adapters/drizzle#joins
            joins: true,
          },
        },
      })
    : null;
