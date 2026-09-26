import { createFileRoute, redirect } from "@tanstack/react-router";

import { defaultLocale } from "#/lib/i18n/config";

export const Route = createFileRoute("/_guest/login")({
  beforeLoad: () => {
    throw redirect({ to: "/$lang/login", params: { lang: defaultLocale } });
  },
});
