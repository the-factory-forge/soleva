import { createFileRoute } from "@tanstack/react-router";

import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { getDictionary, t } from "@/lib/i18n";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { STATIC_PATHS } from "@/lib/site/paths";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const dict = await getDictionary(defaultLocale);
        const siteDescription = t(dict, "meta.home.description");

        const lines: string[] = [
          `# ${SITE_NAME}`,
          "",
          `> ${siteDescription}`,
          "",
          "## Pages",
          ...STATIC_PATHS.map(
            (path) =>
              `- [${path === "" ? "Home" : path}](${SITE_URL}/${defaultLocale}${path})`,
          ),
          "",
          "## Services",
          ...services.map(
            (service) =>
              `- [${service.content[defaultLocale].title}](${SITE_URL}/${defaultLocale}/le-van/${service.slug}) - ${service.content[defaultLocale].shortDescription}`,
          ),
          "",
          "## Languages",
          ...locales.map((locale) => `- [${locale}](${SITE_URL}/${locale})`),
          "",
          "## Contact",
          `- [Website](${SITE_URL})`,
          `- [Email](mailto:${CONTACT.email})`,
          `- [Phone](tel:${CONTACT.phone.replace(/\s/g, "")})`,
          "",
          "## Sitemap",
          `- [Sitemap](${SITE_URL}/sitemap.xml)`,
        ];

        return new Response(lines.join("\n"), {
          headers: { "Content-Type": "text/plain" },
        });
      },
    },
  },
});
