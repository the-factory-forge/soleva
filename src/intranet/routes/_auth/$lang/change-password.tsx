import { createFileRoute, redirect } from "@tanstack/react-router";

import { localeFromPathname } from "#/lib/i18n/pathname";

// Keep existing bookmarks while onboarding moves into the profile.
export const Route = createFileRoute("/_auth/$lang/change-password")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/$lang/intranet",
      params: { lang: localeFromPathname(location.pathname) },
    });
  },
});
