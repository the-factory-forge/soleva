import { createFileRoute, redirect } from "@tanstack/react-router";

import { Link } from "#/components/ui/link";
import { authQueryOptions } from "#/intranet/auth/queries";
import { AccessDeniedPage as SharedAccessDeniedPage } from "#/intranet/components/forge/plugins/login";
import { ensureDictionary, useDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/access-denied")({
  beforeLoad: async ({ context, location }) => {
    // Only meaningful for authenticated users - redirect to the localized login.
    const user = await context.queryClient.query(authQueryOptions());
    if (!user) {
      const locale = localeFromPathname(location.pathname);
      throw redirect({ to: "/$lang/login", params: { lang: locale } });
    }
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
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);

  return <SharedAccessDeniedPage labels={dict.auth} homeHref={`/${locale}`} linkComponent={Link} />;
}
