import { createFileRoute } from "@tanstack/react-router";

import { FaqList } from "@/components/faq/faq-list";
import { PageHero } from "@/components/layout/page-hero";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { faqs } from "@/lib/data/faqs";
import { t } from "@/lib/i18n";
import { ensureDictionary, useDictionary } from "@/lib/i18n/use-dictionary";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/faq")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    await ensureDictionary(locale);
    return { locale };
  },
  head: async ({ loaderData }) => {
    const dict = await ensureDictionary(loaderData!.locale);
    return     metadataToHead(
      buildMetadata({
        locale: loaderData!.locale,
        title: `${dict.meta.faq.title} | ${SITE_NAME}`,
        description: dict.meta.faq.description,
        path: "/faq",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: FaqPage,
});

function FaqPage() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const fq = dict.faq;

  const jsonLdItems = faqs.map((f) => ({
    question: f.question[locale],
    answer: f.answer[locale],
  }));

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={t(dict, "breadcrumb.ariaLabel")}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.faq, href: "/faq" }]}
        eyebrow={fq.hero.eyebrow}
        title={fq.hero.title}
        subtitle={fq.hero.subtitle}
      />

      <FaqJsonLd items={jsonLdItems} />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="mx-auto max-w-3xl">
            <FaqList locale={locale} categoryLabels={fq.categories} />
          </div>
        </div>
      </section>

      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">{fq.cta.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{fq.cta.body}</p>
            <Button
              size="lg"
              className="mt-6"
              render={<Link href={withLocale(locale, "/contact")}>{fq.cta.button}</Link>}
            />
          </div>
        </div>
      </section>
    </>
  );
}
