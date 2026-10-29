import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { $updateProfile } from "#/intranet/auth/functions";
import { useAuthSuspense } from "#/intranet/auth/hooks";
import { isAdmin } from "#/intranet/auth/permissions";
import { authQueryOptions } from "#/intranet/auth/queries";
import { ChangePasswordForm } from "#/intranet/components/change-password-form";
import { AccountPage } from "#/intranet/components/forge/plugins/auth";
import { SecuritySettings } from "#/intranet/security/security-settings";
import { ensureDictionary, useDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/intranet/")({
  validateSearch: z.object({ tab: z.enum(["about", "security"]).optional().catch(undefined) }),
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    await ensureDictionary(locale);
    return { locale };
  },
  head: async ({ loaderData }) => {
    if (loaderData) await ensureDictionary(loaderData.locale);
    return {};
  },
  component: ProfileSettings,
});

function ProfileSettings() {
  const { user } = useAuthSuspense();
  const { locale } = Route.useLoaderData();
  const { tab = "about" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const dict = useDictionary(locale);
  const queryClient = useQueryClient();
  const router = useRouter();
  if (!user) return null;
  if (user.mustChangePassword)
    return (
      <section className="mx-auto grid w-full max-w-7xl gap-6">
        <h1 className="text-2xl font-bold">{t(dict, "profile.title")}</h1>
        <div className="grid max-w-md gap-4">
          <h2 className="font-semibold">{t(dict, "profile.security")}</h2>
          <p className="text-sm text-muted-foreground">{t(dict, "auth.changePasswordSubtitle")}</p>
          <ChangePasswordForm dict={dict} />
        </div>
      </section>
    );
  return (
    <AccountPage
      activeTab={tab}
      onTabChange={(value) => {
        void navigate({
          search: (previous) => ({
            ...previous,
            tab: value === "security" ? "security" : undefined,
          }),
          hash: true,
          resetScroll: false,
        });
      }}
      user={{
        ...user,
        roleLabel: t(dict, isAdmin(user.role) ? "employees.roleAdmin" : "employees.roleUser"),
      }}
      labels={{
        ...dict.profile,
        name: t(dict, "auth.name"),
        email: t(dict, "auth.email"),
        role: t(dict, "employees.role"),
        close: t(dict, "security.done"),
      }}
      onUpdateProfile={async (data) => {
        const updatedUser = await $updateProfile({ data });
        queryClient.setQueryData(authQueryOptions().queryKey, updatedUser);
        await queryClient.invalidateQueries({ queryKey: ["employees"], refetchType: "none" });
        await router.invalidate();
      }}
      security={
        <SecuritySettings
          key={user.id}
          userId={user.id}
          email={user.email}
          dict={dict}
          locale={locale}
        />
      }
    />
  );
}
