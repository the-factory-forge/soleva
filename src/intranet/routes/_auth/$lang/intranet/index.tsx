import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { $updateProfile } from "#/intranet/auth/functions";
import { useAuthSuspense } from "#/intranet/auth/hooks";
import { isAdmin } from "#/intranet/auth/permissions";
import { authQueryOptions } from "#/intranet/auth/queries";
import { AccountPage } from "#/intranet/components/forge/plugins/auth";
import { SecuritySettings } from "#/intranet/security/security-settings";
import { ensureDictionary, useDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/intranet/")({
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
  const dict = useDictionary(locale);
  const queryClient = useQueryClient();
  const router = useRouter();
  if (!user) return null;
  return (
    <AccountPage
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
