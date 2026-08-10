import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  HomeIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/navigation/navbar";
import { authClient } from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";
import { t, type Dictionary } from "@/lib/i18n";
import { locales, localeNames, localeShort, type Locale } from "@/lib/i18n/config";

const SIDEBAR_COLLAPSE_KEY = "sidebar-collapsed";

interface AppShellProps {
  siteName: string;
  navbarProps: Parameters<typeof Navbar>[0];
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}

/**
 * Authenticated shell: the site navbar on top + a collapsible user sidebar
 * on the left. Used for the dashboard AND for site pages while signed in
 * (tc-website AuthenticatedShell pattern).
 */
export function AppShell({
  siteName,
  navbarProps,
  locale,
  dict,
  children,
}: AppShellProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, prev ? "0" : "1");
      return !prev;
    });
  };

  const handleSignOut = async () => {
    const result = await authClient.signOut();
    if (result.error) {
      console.error("Failed to sign out", result.error);
      return;
    }
    queryClient.setQueryData(authQueryOptions().queryKey, null);
    await router.invalidate();
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Site navbar (top) - with theme/font switchers */}
      <Navbar
        {...navbarProps}
        locale={locale}
        locales={[...locales]}
        localeNames={localeNames}
        localeShort={localeShort}
      />

      <div className="flex flex-1">
        {/* User sidebar (left, collapsible) */}
        <aside
          className={`hidden shrink-0 border-r border-border bg-card transition-all duration-200 md:block ${
            collapsed ? "w-14" : "w-60"
          }`}
        >
          <div className="sticky top-16 flex flex-col gap-1 p-3">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {collapsed ? (
                <PanelLeftOpenIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftCloseIcon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {!collapsed && (
              <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {t(dict, "auth.dashboard")}
              </p>
            )}

            <Link
              to={`/${locale}/app`}
              title={t(dict, "auth.dashboard")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LayoutDashboardIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!collapsed && t(dict, "auth.dashboard")}
            </Link>
            <Link
              to={`/${locale}`}
              title={t(dict, "auth.backHome")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!collapsed && t(dict, "auth.backHome")}
            </Link>

            <div className="mt-auto border-t border-border pt-4">
              <button
                type="button"
                onClick={handleSignOut}
                title={t(dict, "auth.signOut")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              >
                <LogOutIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed && t(dict, "auth.signOut")}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
