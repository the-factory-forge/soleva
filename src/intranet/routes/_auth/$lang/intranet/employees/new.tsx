import { createFileRoute, redirect } from "@tanstack/react-router";

import { isAdmin } from "#/intranet/auth/permissions";
import { authQueryOptions } from "#/intranet/auth/queries";
import { localeFromPathname } from "#/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/intranet/employees/new")({
  beforeLoad: async ({ context, location }) => {
    const locale = localeFromPathname(location.pathname);
    const user = await context.queryClient.query(authQueryOptions());
    if (!isAdmin(user?.role)) {
      throw redirect({ to: "/$lang/access-denied", params: { lang: locale } });
    }
    throw redirect({
      to: "/$lang/intranet/employees",
      params: { lang: locale },
      replace: true,
    });
  },
});
