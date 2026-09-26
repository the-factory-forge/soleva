import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { authQueryOptions } from "#/intranet/auth/queries";
import { AuthScreen } from "#/intranet/components/auth-screen";
import { ChangePasswordForm } from "#/intranet/components/change-password-form";
import { ensureDictionary, useDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { SITE_NAME } from "@/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/change-password")({
  beforeLoad: async ({ context, location }) => {
    // Signed out? Back to the localized login.
    const locale = localeFromPathname(location.pathname);
    const user = await context.queryClient.query(authQueryOptions());
    if (!user) {
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
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const navigate = useNavigate();

  return (
    <AuthScreen locale={locale} dict={dict} siteName={SITE_NAME}>
      <ChangePasswordForm
        dict={dict}
        asPage
        onSuccess={() => navigate({ to: "/$lang/intranet", params: { lang: locale } })}
      />
    </AuthScreen>
  );
}
