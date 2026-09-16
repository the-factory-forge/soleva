import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";

import { AuthScreen } from "#/components/auth/auth-screen";
import { SignInSocialButton } from "#/components/sign-in-social-button";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { toast } from "#/components/ui/toast";
import { authClient } from "#/lib/auth/auth-client";
import { $getAuthProviders, $getUser } from "#/lib/auth/functions";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { SITE_NAME } from "@/lib/site/constants";

export const Route = createFileRoute("/_auth/$lang/login")({
  beforeLoad: async ({ location }) => {
    // Already signed in - go to the localized dashboard.
    const user = await $getUser();
    if (user) {
      const locale = localeFromPathname(location.pathname);
      throw redirect({ to: "/$lang/app", params: { lang: locale } });
    }
  },
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    const providers = await $getAuthProviders();
    return { locale, dict, providers };
  },
  component: LoginPage,
});

function LoginPage() {
  const { locale, dict, providers } = Route.useLoaderData();
  const { github, google } = providers;

  const { mutate: emailLoginMutate, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await authClient.signIn.email(
        {
          ...data,
          callbackURL: `/${locale}/app`,
        },
        {
          onError: ({ error }) => {
            toast.add({
              type: "error",
              description: error.message || t(dict, "auth.loginError"),
            });
          },
        },
      ),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    emailLoginMutate({ email, password });
  };

  return (
    <AuthScreen locale={locale} dict={dict} siteName={SITE_NAME}>
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {t(dict, "auth.welcomeBack")}
          </h1>
          <p className="text-sm text-muted-foreground">{t(dict, "auth.welcomeSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">{t(dict, "auth.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                readOnly={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t(dict, "auth.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                readOnly={isPending}
                required
              />
            </div>
            <Button type="submit" className="mt-2 w-full" size="lg" disabled={isPending}>
              {isPending && <LoaderCircleIcon className="animate-spin" />}
              {isPending ? t(dict, "auth.signingIn") : t(dict, "auth.signIn")}
            </Button>
          </div>
        </form>

        {(github || google) && (
          <>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                {t(dict, "auth.orDivider")}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {github && (
                <SignInSocialButton
                  provider="github"
                  callbackURL={`/${locale}/app`}
                  disabled={isPending}
                  icon={<SiGithub className="size-4" />}
                />
              )}
              {google && (
                <SignInSocialButton
                  provider="google"
                  callbackURL={`/${locale}/app`}
                  disabled={isPending}
                  icon={<SiGoogle className="size-4" />}
                />
              )}
            </div>
          </>
        )}

        <div className="text-center text-sm">
          {t(dict, "auth.dontHaveAccount")}{" "}
          <Link
            to="/$lang/signup"
            params={{ lang: locale }}
            className="underline underline-offset-4"
          >
            {t(dict, "auth.signUpLink")}
          </Link>
        </div>
      </div>
    </AuthScreen>
  );
}
