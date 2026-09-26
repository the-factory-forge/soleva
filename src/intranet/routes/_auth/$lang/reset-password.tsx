import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Link } from "#/components/ui/link";
import { authClient } from "#/intranet/auth/auth-client";
import { authQueryOptions, loginOptionsQueryOptions } from "#/intranet/auth/queries";
import { AuthScreen } from "#/intranet/components/auth-screen";
import { ResetPasswordForm } from "#/intranet/components/forge/plugins/login";
import { ensureDictionary, t, useDictionary } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";
import { SITE_NAME } from "#/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/reset-password")({
  validateSearch: z.object({
    token: z.string().min(1).max(256).optional().catch(undefined),
    error: z.string().optional().catch(undefined),
  }),
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
    return { meta: [{ title: `${t(dict, "auth.resetTitle")} | ${SITE_NAME}` }] };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { locale } = Route.useLoaderData();
  const { token, error } = Route.useSearch();
  const dict = useDictionary(locale);
  const { data: options } = useSuspenseQuery(loginOptionsQueryOptions());
  const queryClient = useQueryClient();
  const reset = useMutation({
    mutationFn: async (newPassword: string) => {
      if (!token || error || !options.passwordReset)
        throw new Error(t(dict, "auth.invalidResetLink"));
      const result = await authClient.resetPassword({ newPassword, token });
      if (result.error) throw new Error(t(dict, "auth.resetError"));
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryOptions().queryKey, null);
    },
  });
  return (
    <AuthScreen locale={locale} dict={dict} siteName={SITE_NAME}>
      <ResetPasswordForm
        key={token ?? "invalid"}
        labels={dict.auth}
        enabled={options.passwordReset}
        validLink={Boolean(token) && !error}
        loginHref={`/${locale}/login`}
        requestResetHref={`/${locale}/forgot-password`}
        linkComponent={Link}
        onResetPassword={reset.mutateAsync}
      />
    </AuthScreen>
  );
}
