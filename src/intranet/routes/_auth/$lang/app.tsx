import { createFileRoute, redirect } from "@tanstack/react-router";

import { localeFromPathname } from "#/lib/i18n/pathname";
export const Route = createFileRoute("/_auth/$lang/app")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/${localeFromPathname(location.pathname)}/intranet` });
  },
});
