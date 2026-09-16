import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/auth/app-shell";
import { authQueryOptions } from "@/lib/auth/queries";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/app")({
  beforeLoad: async ({ context, location }) => {
    // Protected route - redirect to the localized login when signed out.
    const user = await context.queryClient.query(authQueryOptions());
    if (!user) {
      const locale = localeFromPathname(location.pathname);
      throw redirect({ to: "/$lang/login", params: { lang: locale } });
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

  return (
    <AppShell locale={locale} dict={dict}>
      <Outlet />
    </AppShell>
  );
}
