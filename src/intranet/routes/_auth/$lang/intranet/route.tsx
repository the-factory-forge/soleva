import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";

import { useAuthSuspense } from "#/intranet/auth/hooks";
import { authQueryOptions } from "#/intranet/auth/queries";
import { AppShell } from "#/intranet/components/app-shell";
import { ensureDictionary, useDictionary, t } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";
import { SITE_NAME } from "#/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/intranet")({
  beforeLoad: async ({ context, location }) => {
    const locale = localeFromPathname(location.pathname);
    const user = await context.queryClient.query(authQueryOptions());
    if (!user) throw redirect({ to: "/$lang/login", params: { lang: locale } });
    if (user.mustChangePassword)
      throw redirect({ to: "/$lang/change-password", params: { lang: locale } });
  },
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    await ensureDictionary(locale);
    return { locale };
  },
  head: async ({ loaderData }) => {
    if (loaderData) await ensureDictionary(loaderData.locale);
    return {};
  },
  component: AppLayout,
});

function AppLayout() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const { user } = useAuthSuspense();
  if (!user) return null;

  return (
    <AppShell siteName={SITE_NAME} locale={locale} dict={dict} user={user}>
      <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6">
        <Suspense fallback={<p role="status">{t(dict, "employees.loading")}</p>}>
          <Outlet />
        </Suspense>
      </main>
    </AppShell>
  );
}
