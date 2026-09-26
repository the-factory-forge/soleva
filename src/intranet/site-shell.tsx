import { useQuery, type QueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";

import { PublicShell } from "#/components/layouts/public-shell";
import { useDictionary } from "#/lib/i18n";
import { SITE_NAME } from "#/lib/site/constants";

import { authEnabledQueryOptions, authQueryOptions } from "./auth/queries";
import { AppShell } from "./components/app-shell";

export async function load(queryClient: QueryClient) {
  const { enabled } = await queryClient.query(authEnabledQueryOptions());
  if (enabled) await queryClient.query(authQueryOptions());
  return enabled;
}

export function Shell(props: ComponentProps<typeof PublicShell>) {
  const dict = useDictionary(props.locale);
  const { data: auth } = useQuery(authEnabledQueryOptions());
  const { data: user } = useQuery({ ...authQueryOptions(), enabled: auth?.enabled === true });

  if (user && !user.mustChangePassword) {
    return (
      <AppShell
        siteName={SITE_NAME}
        locale={props.locale}
        dict={dict}
        controls={props.controls}
        user={user}
      >
        {props.children}
      </AppShell>
    );
  }

  return <PublicShell {...props} />;
}
