import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ensureDictionary, useDictionary } from "@/lib/i18n/use-dictionary";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    await ensureDictionary(locale);
    return { locale };
  },
  component: Outlet,
});
