import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Link } from "#/components/ui/link";
import { authClient } from "#/intranet/auth/auth-client";
import { $getInvitationEmail } from "#/intranet/auth/functions";
import { authQueryOptions, loginOptionsQueryOptions } from "#/intranet/auth/queries";
import { AuthScreen } from "#/intranet/components/auth-screen";
import { ResetPasswordForm } from "#/intranet/components/forge/plugins/auth";
import { ensureDictionary, t, useDictionary } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";
import { SITE_NAME } from "#/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/reset-password")({
  validateSearch: z.object({
    invitation: z.coerce.boolean().optional().catch(false),
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
  const { token, error, invitation } = Route.useSearch();
  const dict = useDictionary(locale);
  const { data: options } = useSuspenseQuery(loginOptionsQueryOptions());
  const queryClient = useQueryClient();
  const reset = useMutation({
    mutationFn: async (newPassword: string) => {
      if (!token || error || !options.passwordReset)
        throw new Error(t(dict, "auth.invalidResetLink"));
      const email = invitation ? await $getInvitationEmail({ data: { token } }) : null;
      if (invitation && !email) throw new Error(t(dict, "auth.invalidResetLink"));
      const result = await authClient.resetPassword({ newPassword, token });
      if (result.error) throw new Error(t(dict, "auth.resetError"));
      if (!email) return false;
      try {
        const signIn = await authClient.signIn.email({ email, password: newPassword });
        return !signIn.error;
      } catch {
        // Activation succeeded; offer login rather than retrying the consumed token.
        return false;
      }
    },
    onSuccess: (signedIn) => {
      if (signedIn) {
        queryClient.clear();
        // Reload with the recipient cookie; the existing login guard chooses the destination.
        window.location.replace(`/${locale}/login`);
        return;
      }
      queryClient.setQueryData(authQueryOptions().queryKey, null);
    },
  });
  return (
    <AuthScreen locale={locale} dict={dict} siteName={SITE_NAME}>
      <ResetPasswordForm
        key={token ?? "invalid"}
        labels={
          invitation
            ? {
                ...dict.auth,
                resetTitle: dict.employees.invitationTitle,
                resetDescription: dict.employees.invitationDescription,
                resetSubmit: dict.auth.invitationSubmit,
                resetSuccess: dict.auth.invitationSuccess,
              }
            : dict.auth
        }
        enabled={options.passwordReset}
        validLink={Boolean(token) && !error}
        loginHref={`/${locale}/login`}
        requestResetHref={`/${locale}/forgot-password`}
        linkComponent={Link}
        onResetPassword={async (password) => {
          await reset.mutateAsync(password);
        }}
      />
    </AuthScreen>
  );
}
