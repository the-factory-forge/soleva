import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/auth/app-shell";
import { $getUser } from "@/lib/auth/functions";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { SITE_NAME } from "@/lib/site/constants";
import { getNavbarProps } from "@/lib/site/navigation";

export const Route = createFileRoute("/_auth/$lang/app")({
  beforeLoad: async ({ location }) => {
    // Protected route - redirect to the localized login when signed out.
    const user = await $getUser();
    if (!user) {
      const locale = localeFromPathname(location.pathname);
      throw redirect({ to: `/${locale}/login` });
    }
  },
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  component: AppLayout,
});

function AppLayout() {
  const { locale, dict } = Route.useLoaderData();
  const navbarProps = getNavbarProps(locale, dict);

  return (
    <AppShell siteName={SITE_NAME} navbarProps={navbarProps} locale={locale} dict={dict}>
      <Outlet />
    </AppShell>
  );
}
