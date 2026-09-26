import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Link } from "#/components/ui/link";
import { authClient } from "#/intranet/auth/auth-client";
import { loginOptionsQueryOptions } from "#/intranet/auth/queries";
import { AuthScreen } from "#/intranet/components/auth-screen";
import { ForgotPasswordForm } from "#/intranet/components/forge/plugins/login";
import { ensureDictionary, t, useDictionary } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";
import { SITE_NAME } from "#/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/forgot-password")({
  loader: async ({ context, location }) => {
    const locale = localeFromPathname(location.pathname);
    await Promise.all([
      ensureDictionary(locale),
      context.queryClient.query(loginOptionsQueryOptions()),
    ]);
    return { locale };
  },
  head: async ({ loaderData }) => {
    if (!loaderData) return {};
    const dict = await ensureDictionary(loaderData.locale);
    return { meta: [{ title: `${t(dict, "auth.forgotTitle")} | ${SITE_NAME}` }] };
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const { data: options } = useSuspenseQuery(loginOptionsQueryOptions());
  const requestReset = useMutation({
    mutationFn: async (email: string) => {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `/${locale}/reset-password`,
      });
      if (result.error) throw new Error(t(dict, "auth.resetRequestError"));
    },
  });
  return (
    <AuthScreen locale={locale} dict={dict} siteName={SITE_NAME}>
      <ForgotPasswordForm
        labels={dict.auth}
        enabled={options.passwordReset}
        loginHref={`/${locale}/login`}
        linkComponent={Link}
        onRequestReset={requestReset.mutateAsync}
      />
    </AuthScreen>
  );
}
