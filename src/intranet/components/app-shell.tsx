import { Link, useRouterState } from "@tanstack/react-router";
import { UserRoundIcon, UsersIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Navbar } from "#/components/navigation/navbar";
import { useSignOut, type useAuth } from "#/intranet/auth/hooks";
import { isAdmin } from "#/intranet/auth/permissions";
import { IntranetShell } from "#/intranet/components/forge/intranet/intranet-shell";
import type {
  IntranetLinkProps,
  IntranetNavGroup,
} from "#/intranet/components/forge/navigation/intranet-sidebar";
import { t, type Dictionary } from "#/lib/i18n";
import { type Locale } from "#/lib/i18n/config";
import { SITE_LOGO_MARK } from "#/lib/site/constants";

function SidebarLink({ href, ...props }: IntranetLinkProps) {
  return <Link to={href} {...props} />;
}

interface AppShellProps {
  siteName: string;
  locale: Locale;
  dict: Dictionary;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  controls?: ReactNode;
  children: ReactNode;
}

/** Host integration for the shared registry shell. Add installed modules to the groups here. */
export function AppShell({ siteName, locale, dict, user, controls, children }: AppShellProps) {
  const signOut = useSignOut();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const groups: IntranetNavGroup[] = [
    {
      id: "workspace",
      items: [
        {
          id: "profile",
          label: t(dict, "profile.title"),
          href: `/${locale}/intranet`,
          exact: true,
          icon: <UserRoundIcon />,
        },
        ...(isAdmin(user.role)
          ? [
              {
                id: "employees",
                label: t(dict, "employees.title"),
                href: `/${locale}/intranet/employees`,
                icon: <UsersIcon />,
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <IntranetShell
      brand={{
        name: siteName,
        href: `/${locale}`,
        logo: <img src={SITE_LOGO_MARK} alt="" width={28} height={28} />,
      }}
      user={user}
      pathname={pathname}
      groups={groups}
      linkComponent={SidebarLink}
      profileHref={`/${locale}/intranet`}
      onSignOut={signOut}
      labels={{
        navigation: t(dict, "auth.sideNavigation"),
        toggle: t(dict, "auth.toggleNavigation"),
        close: t(dict, "common.close"),
        expand: t(dict, "auth.expand"),
        collapse: t(dict, "auth.collapse"),
        profile: t(dict, "profile.title"),
        userMenu: t(dict, "auth.accountMenu"),
        signOut: t(dict, "auth.signOut"),
        signingOut: t(dict, "auth.signingOut"),
        signOutError: t(dict, "auth.signOutError"),
      }}
      insetAs="div"
      wrapContent={false}
      renderTopbar={(toggle) => (
        <div className="flex items-center gap-2 bg-background px-2 print:hidden">
          {toggle}
          <div className="min-w-0 flex-1">
            <Navbar locale={locale} dict={dict} embedded />
          </div>
        </div>
      )}
    >
      {children}
    </IntranetShell>
  );
}
