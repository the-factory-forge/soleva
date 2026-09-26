import { createFileRoute, redirect } from "@tanstack/react-router";

import { defaultLocale } from "#/lib/i18n/config";

export const Route = createFileRoute("/_guest/intranet")({
  beforeLoad: () => {
    throw redirect({ to: "/$lang/intranet", params: { lang: defaultLocale } });
  },
});
