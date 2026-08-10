import { createFileRoute, Outlet } from "@tanstack/react-router";

import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  component: Outlet,
});
