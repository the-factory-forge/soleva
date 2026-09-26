import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { $isAuthEnabled } from "#/intranet/auth/functions";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    // Auth disabled (no database configured) - showcase sites have no login.
    const { enabled } = await $isAuthEnabled();
    if (!enabled) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: Outlet,
});
