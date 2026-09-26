# Auth Conventions

## Auth Architecture

- Better Auth config lives in `src/intranet/auth/auth.ts`.
- Auth utilities are centralized in `src/intranet/auth/*`.
- In components, prefer shared auth hooks (`useAuth`, `useAuthSuspense`) from `src/intranet/auth/hooks.ts`. These reuse the same auth data as the route loader.
- When navigation-critical route logic needs auth data, read `authQueryOptions` through the existing `context.queryClient`, following `_auth/$lang/intranet/route.tsx`.

## Route Guards

- The `src/intranet/routes/_auth/route.tsx` layout redirects to `/` when the optional auth feature is disabled.
- Protected app layout is `src/intranet/routes/_auth/$lang/intranet/route.tsx`.
  - It enforces auth in `beforeLoad` using TanStack Query and preserves the locale in redirects.
- `src/intranet/routes/_auth/$lang/login.tsx` redirects authenticated users to their localized app.
- `/login` redirects to the default locale. Public signup routes are absent.
- Users with `mustChangePassword` must complete the localized password-change flow first.
- Drizzle SQL migrations bootstrap `admin@example.com` / `admin` only when the user table is empty. The September 2026 prelaunch reset puts account creation in the fresh SQL baseline; later changes use incremental SQL migrations, not a TypeScript startup seed. Never change existing users or passwords, or seed merely because no admin exists. No forced password change is set; change the default password during handover. Drizzle records migrations once, so deleted users are not recreated on later restarts.

## Server Functions and Mutations

- Server functions can be called from both server and client code.
  - Server call: executed directly on the server.
  - Client call: treated as RPC and executed through an HTTP API request.
- Treat protected server functions like protected API routes from a security perspective.
- If a server function requires auth, always apply `authMiddleware` or `freshAuthMiddleware` from `src/intranet/auth/middleware.ts`. This applies even when called from an auth-protected route (`routes/_auth/**`).
- All auth middleware reads a fresh session. Use `authMiddleware` for authenticated actions; it also requires first-login password changes to be complete. Use `adminMiddleware` for employee management and other administrator operations.
- `freshAuthMiddleware` only verifies the session and is reserved for onboarding actions such as changing the temporary password.
- Better Auth uses its default `admin` and `user` roles. Use native create/ban/unban APIs so disabling access also revokes sessions.
- Session lookup lives in `src/intranet/auth/session.ts`. Keep it independent of server functions to avoid a circular middleware import.
- Route-level `beforeLoad` guards protect route navigation/rendering, but they do not replace server-function authorization.
- When auth is required, middleware-provided user context is the source of truth.
