import { createFileRoute } from "@tanstack/react-router";

import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { blogPosts } from "@/lib/data/blog";
import { faqs } from "@/lib/data/faqs";
import { services } from "@/lib/data/services";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { STATIC_PATHS, PAGE_META_KEYS } from "@/lib/site/paths";

export const Route = createFileRoute("/api/data.json")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const rawLocale = url.searchParams.get("locale") ?? defaultLocale;
        const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
        const dict = await getDictionary(locale);

        const data = {
          "@context": "https://schema.org",
          "@graph": [
            ...STATIC_PATHS.map((path) => {
              const meta =
                path === "/plan-du-site"
                  ? dict.directory
                  : dict.meta[PAGE_META_KEYS[path] ?? path.slice(1)];
              return {
                "@type": "WebPage",
                "@id": `${SITE_URL}/${locale}${path}`,
                url: `${SITE_URL}/${locale}${path}`,
                name: meta.title,
                description: meta.description,
                inLanguage: locale,
                isPartOf: { "@id": `${SITE_URL}/#website` },
              };
            }),
            ...blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title[locale],
              description: post.excerpt[locale],
              url: `${SITE_URL}/${locale}/blog#${post.slug}`,
              datePublished: post.date.split(".").reverse().join("-"),
              inLanguage: locale,
            })),
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
