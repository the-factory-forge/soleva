import { createFileRoute } from "@tanstack/react-router";

import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { faqs } from "@/lib/data/faqs";
import { services } from "@/lib/data/services";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export const Route = createFileRoute("/api/data.json")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const rawLocale = url.searchParams.get("locale") ?? defaultLocale;
        const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;

        const data = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              name: `${SITE_NAME} services`,
              itemListElement: services.map((service, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Service",
                  name: service.content[locale].title,
                  description: service.content[locale].shortDescription,
                  url: `${SITE_URL}/${locale}/le-van/${service.slug}`,
                  provider: { "@type": "NGO", name: SITE_NAME, url: SITE_URL },
                },
              })),
            },
            {
              "@type": "FAQPage",
              name: `${SITE_NAME} FAQ`,
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question[locale],
                acceptedAnswer: { "@type": "Answer", text: faq.answer[locale] },
              })),
            },
          ],
        };

        return Response.json(data);
      },
    },
  },
});
