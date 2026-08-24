import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Home, Leaf, Recycle, Sun } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { PillarSuggestions } from "@/components/ui/pillar-suggestions";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { habitatContent } from "@/lib/data/habitat";
import { getServiceBySlug } from "@/lib/data/services";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/impact")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) =>
    metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${loaderData.dict.meta.impact.title} | ${SITE_NAME}`,
        description: loaderData.dict.meta.impact.description,
        path: "/impact",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    ),
  component: ImpactPage,
});

function ImpactPage() {
  const { locale, dict } = Route.useLoaderData();
  const t = dict.impact;

  const cards = [
    { icon: Leaf, title: t.cards.carbon_title, desc: t.cards.carbon_desc },
    { icon: Recycle, title: t.cards.circular_title, desc: t.cards.circular_desc },
    { icon: Sun, title: t.cards.solar_title, desc: t.cards.solar_desc },
    { icon: GraduationCap, title: t.cards.awareness_title, desc: t.cards.awareness_desc },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.impact, href: "/impact" }]}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={IMAGES.impact}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={i * 0.06}>
                  <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 font-heading text-xl font-bold text-foreground">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {card.desc}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-muted-foreground italic">
            {t.disclaimer}
          </p>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="absolute inset-0 -z-10">
          <Image
            src={IMAGES.journey}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="container-premium section-padding">
          <SectionHeading inverted title={t.hero.title} subtitle={t.hero.subtitle} />
        </div>
      </section>

      <PillarSuggestions
        locale={locale}
        dict={dict}
        items={[
          {
            href: "/le-van/systeme-solaire",
            icon: getServiceBySlug("systeme-solaire")!.icon,
            title: getServiceBySlug("systeme-solaire")!.content[locale].title,
            description: getServiceBySlug("systeme-solaire")!.content[locale].shortDescription,
          },
          {
            href: "/habitat",
            icon: Home,
            title: dict.breadcrumb.habitat,
            description: habitatContent[locale].hero.subtitle,
          },
        ]}
      />

      <CtaBand
        locale={locale}
        title={dict.home.cta.title}
        body={dict.home.cta.body}
        buttonLabel={dict.common.contact_us}
        href="/contact"
      />
    </>
  );
}
