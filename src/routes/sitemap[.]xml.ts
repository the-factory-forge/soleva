import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { locales } from "@/lib/i18n/config";
import { STATIC_PATHS } from "@/lib/site/paths";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const now = new Date().toISOString();
        const urls: string[] = [];

        for (const locale of locales) {
          for (const path of STATIC_PATHS) {
            const full = `${SITE_URL}/${locale}${path}`;
            const alternates = locales
              .map(
                (alt) =>
                  `<xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}/${alt}${path}"/>`,
              )
              .join("");
            urls.push(
              `<url><loc>${full}</loc><lastmod>${now}</lastmod><changefreq>${
                path === "" ? "weekly" : "monthly"
              }</changefreq><priority>${path === "" ? "1.0" : "0.7"}</priority>${alternates}</url>`,
            );
          }
          for (const service of services) {
            const path = `/le-van/${service.slug}`;
            const full = `${SITE_URL}/${locale}${path}`;
            const alternates = locales
              .map(
                (alt) =>
                  `<xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}/${alt}${path}"/>`,
              )
              .join("");
            urls.push(
              `<url><loc>${full}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>${alternates}</url>`,
            );
          }
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
