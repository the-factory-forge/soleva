import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { FadeUp as Reveal } from "@/components/animations-lazy";
import { IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { sponsorCategories, sponsoringIntro, type Sponsor } from "@/lib/data/sponsors";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

function SponsorCard({ item, label }: { item: Sponsor; label: string }) {
  const clickable = Boolean(item.url) && item.linkStatus !== "broken";
  const outer =
    "flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 text-center";
  const hoverClass = clickable ? "transition-colors hover:border-primary/60 hover:bg-card" : "";

  const inner = (
    <>
      {item.logo ? (
        <div className="relative h-14 w-24">
          <Image
            src={item.logo}
            alt={item.name}
            fill
            className="object-contain"
            sizes="96px"
          />
        </div>
      ) : null}
      <span className="text-sm font-semibold text-foreground">{item.name}</span>
      {clickable ? (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {label}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  return clickable ? (
    <a
      href={item.url!}
      target="_blank"
      rel="noopener noreferrer"
      className={`${outer} ${hoverClass}`}
    >
      {inner}
    </a>
  ) : (
    <div className={outer}>{inner}</div>
  );
}

export const Route = createFileRoute("/_site/$lang/sponsoring")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) => {
    const dict = loaderData!.dict;
    return metadataToHead(
      buildMetadata({
        locale: loaderData!.locale,
        title: `${dict.meta.sponsoring.title} | ${SITE_NAME}`,
        description: dict.meta.sponsoring.description,
        path: "/sponsoring",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: SponsoringPage,
});

function SponsoringPage() {
  const { locale, dict } = Route.useLoaderData();
  const s = dict.sponsoring;

  const sponsors = sponsorCategories.find((c) => c.key === "sponsors")?.items ?? [];
  const collaborations = sponsorCategories.find((c) => c.key === "collaborations")?.items ?? [];
  const media = sponsorCategories.find((c) => c.key === "media")?.items ?? [];

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.sponsoring, href: "/sponsoring" }]}
        eyebrow={s.hero.eyebrow}
        title={s.hero.title}
        subtitle={s.hero.subtitle}
        image={IMAGES.workshop}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <p className="mx-auto max-w-2xl text-center leading-relaxed text-muted-foreground">
            {sponsoringIntro[locale]}
          </p>

          <div className="mt-12 space-y-12">
            {/* Sponsors */}
            <div>
              <h3 className="text-center text-sm font-semibold tracking-wider text-primary uppercase">
                {s.categories.sponsors}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {sponsors.map((item, i) => (
                  <Reveal key={`sponsor-${item.name}-${i}`} delay={i * 0.06}>
                    <SponsorCard item={item} label={s.external_label} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Collaborations */}
            <div>
              <h3 className="text-center text-sm font-semibold tracking-wider text-primary uppercase">
                {s.categories.collaborations}
              </h3>
              <div className="mx-auto mt-4 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
                {collaborations.map((item, i) => (
                  <Reveal key={`collaboration-${item.name}-${i}`} delay={i * 0.06}>
                    <SponsorCard item={item} label={s.external_label} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Media partners */}
            <div>
              <h3 className="text-center text-sm font-semibold tracking-wider text-primary uppercase">
                {s.categories.media}
              </h3>
              <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-4">
                {media.map((item, i) => (
                  <Reveal key={`media-${item.name}-${i}`} delay={i * 0.06}>
                    <SponsorCard item={item} label={s.external_label} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={s.cta.title}
        body={s.cta.body}
        buttonLabel={dict.common.contact_us}
        href="/contact"
      />
    </>
  );
}
