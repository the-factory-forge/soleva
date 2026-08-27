import { a11yDevtoolsPlugin } from "@tanstack/devtools-a11y/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Toaster } from "@/components/ui/toast";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

import appCss from "@/styles.css?url";

const SITE_DESCRIPTION =
  "Soleva transforme un ancien van en camper électrique alimenté par le soleil. Un démonstrateur suisse de mobilité durable.";

// WebSite linked by @id to the v0 OrganizationJsonLd node (#organization
// anchor) - site-wide context for AI systems (GEO).
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: ["fr", "en", "de", "it"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#ff803e",
      },
      {
        title: "Soleva",
      },
      {
        name: "description",
        content: SITE_DESCRIPTION,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        href: "/assets/montserrat-latin-400-normal-BLhwKU8k.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/assets/montserrat-latin-600-normal-UVxSCcoG.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/assets/montserrat-latin-700-normal-BdjcYUrC.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "https://assets.the-corner.io/logos/the_corner-icon.png" },
      { rel: "apple-touch-icon", href: "https://assets.the-corner.io/logos/the_corner-icon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
      {
        // Consent Mode v2 - default-deny before anything loads. The Google tag
        // (gtag.js) itself is NOT loaded here: it is injected dynamically by
        // loadGtag() (src/lib/analytics.ts) only after the visitor accepts in
        // the cookie banner (nLPD - nothing loads before consent).
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500,
          });
        `,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  // The root document renders for every route - derive the html lang from the
  // pathname so localized pages (en/de/it) don't all declare "fr".
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const raw = (pathname.match(/^\/([^/]+)/) ?? [])[1] ?? "";
  const lang = isLocale(raw) ? raw : defaultLocale;

  return (
    <html lang={lang} className="bg-background" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />

        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            a11yDevtoolsPlugin(),
          ]}
        />

        <Scripts />
      </body>
    </html>
  );
}
