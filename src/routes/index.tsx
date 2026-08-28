import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { defaultLocale, isLocale } from "@/lib/i18n/config";

// Pick the visitor's preferred locale from the Accept-Language header
// (e.g. "fr-CH,fr;q=0.9,en;q=0.8" -> fr). Runs on the server (SSR) and via
// RPC on client-side navigations; falls back to the default locale.
const $detectLocale = createServerFn({ method: "GET" }).handler(() => {
  const request = getRequest();
  const accept = request?.headers.get("accept-language") ?? "";
  const tags = accept.split(",").map((part) => part.split(";")[0].trim().toLowerCase());
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
});

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const locale = await $detectLocale();
    throw redirect({ href: `/${locale}` });
  },
});
