import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { $isAuthEnabled } from "#/lib/auth/functions";

export const Route = createFileRoute("/_auth")({
  component: Outlet,
  beforeLoad: async () => {
    // Auth disabled (no database configured) - showcase sites have no login.
    const { enabled } = await $isAuthEnabled();
    if (!enabled) {
      throw redirect({ to: "/" });
    }
  },
});
