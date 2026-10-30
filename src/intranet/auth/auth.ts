import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import "@tanstack/react-start/server-only";
import { APIError, createAuthMiddleware, getAuthoritativeSessionFromCtx } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { admin as adminPlugin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { and, eq, like } from "drizzle-orm";
import { ENV } from "varlock/env";

import { db } from "#/intranet/db";
import * as schema from "#/intranet/db/schema";

import { sessionSignInMethod } from "./sign-in-method";
import { sendPasswordResetEmail, sendVerificationEmail } from "./verification-email";

export const auth = betterAuth({
  secret: ENV.BETTER_AUTH_SECRET,
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

  session: {
    additionalFields: {
      signInMethod: { type: "string", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      update: {
        after: async (user, context) => {
          // Admin changes invalidate links issued for the previous account details.
          if (context?.path?.startsWith("/admin/")) {
            await db
              .delete(schema.verification)
              .where(
                and(
                  eq(schema.verification.value, user.id),
                  like(schema.verification.identifier, "reset-password:%"),
                ),
              );
          }
        },
      },
    },
    session: {
      create: {
        before: async (session, context) => ({
          data: {
            ...session,
            signInMethod: sessionSignInMethod(context?.path, context?.params?.id),
          },
        }),
      },
    },
  },

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
    ...(ENV.EMAIL_API_KEY && ENV.EMAIL_FROM ? { sendResetPassword: sendPasswordResetEmail } : {}),
    resetPasswordTokenExpiresIn: 3600,
    revokeSessionsOnPasswordReset: true,
    onPasswordReset: async ({ user }) => {
      await db
        .delete(schema.verification)
        .where(
          and(
            eq(schema.verification.value, user.id),
            like(schema.verification.identifier, "reset-password:%"),
          ),
        );
      await db
        .update(schema.user)
        .set({ mustChangePassword: false, emailVerified: true })
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
});
