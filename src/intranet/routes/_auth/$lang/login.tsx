import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";

import { authClient } from "#/intranet/auth/auth-client";
import { authQueryOptions, loginOptionsQueryOptions } from "#/intranet/auth/queries";
import { AuthScreen } from "#/intranet/components/auth-screen";
import { LoginForm } from "#/intranet/components/forge/plugins/login";
import { ensureDictionary, useDictionary, t } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";
import { SITE_NAME } from "#/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/login")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.query(authQueryOptions());
    if (user) {
      const locale = localeFromPathname(location.pathname);
      throw redirect({ to: "/$lang/intranet", params: { lang: locale } });
    }
  },
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
    return { meta: [{ title: `${t(dict, "auth.signIn")} | ${SITE_NAME}` }] };
  },
  component: LoginPage,
});

function LoginPage() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const { data: options } = useSuspenseQuery(loginOptionsQueryOptions());
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  return (
    <AuthScreen locale={locale} dict={dict} siteName={SITE_NAME}>
      <LoginForm
        enabled={options.enabled}
        labels={dict.auth}
        forgotPasswordHref={`/${locale}/forgot-password`}
        onSignIn={async (credentials) => {
          const result = await authClient.signIn.email(credentials);
          if (result.error) throw new Error(t(dict, "auth.loginError"));
          await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey });
          await router.invalidate();
          await navigate({ to: "/$lang/intranet", params: { lang: locale } });
        }}
        onGoogleSignIn={
          options.google
            ? async () => {
                const result = await authClient.signIn.social({
                  provider: "google",
                  callbackURL: `/${locale}/intranet`,
                });
                if (result.error) throw new Error(t(dict, "auth.googleError"));
              }
            : undefined
        }
      />
    </AuthScreen>
  );
}
