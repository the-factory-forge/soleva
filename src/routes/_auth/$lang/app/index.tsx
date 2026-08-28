import { createFileRoute } from "@tanstack/react-router";

import { useAuthSuspense } from "#/lib/auth/hooks";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/app/")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { dict };
  },
  component: AppIndex,
});

function AppIndex() {
  const { user } = useAuthSuspense();
  const { dict } = Route.useLoaderData();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        {t(dict, "auth.appWelcome")}, {user?.name ?? "there"} 👋
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t(dict, "auth.signedInAs")}{" "}
        <span className="font-medium text-foreground">{user?.email}</span>.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">{t(dict, "auth.appIntro")}</p>
    </div>
  );
}
