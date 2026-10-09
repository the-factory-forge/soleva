import { useQuery, type QueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";

import { PublicShell } from "#/components/layouts/public-shell";
import { useDictionary } from "#/lib/i18n";
import { SITE_NAME } from "#/lib/site/constants";

import { authQueryOptions } from "./auth/queries";
import { AppShell } from "./components/app-shell";

export async function load(queryClient: QueryClient) {
  await queryClient.query(authQueryOptions());
  return true;
}

export function Shell(props: ComponentProps<typeof PublicShell>) {
  const dict = useDictionary(props.locale);
  const { data: user } = useQuery(authQueryOptions());

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
