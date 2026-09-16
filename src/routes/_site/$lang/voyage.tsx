import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Link } from "@/components/ui/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { IMAGES, SITE_NAME, SITE_URL, srcSetFor } from "@/lib/constants";
import { POLAR_STEPS_URL, pastEvents } from "@/lib/data/events";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/voyage")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const dict = loaderData.dict;
    return metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${dict.meta.voyage.title} | ${SITE_NAME}`,
        description: dict.meta.voyage.description,
        path: "/voyage",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: VoyagePage,
});

function VoyagePage() {
  const { locale, dict } = Route.useLoaderData();
  const t = dict.voyage;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.voyage, href: "/voyage" }]}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={IMAGES.journey}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Lightbox src={IMAGES.hero} alt="">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={IMAGES.hero}
                    alt=""
                    fill
                    srcSet={srcSetFor(IMAGES.hero)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Lightbox>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <SectionHeading align="left" title={t.tour_title} subtitle={t.tour_body} />
                <p className="mt-8 font-heading text-2xl font-bold text-primary">{t.dates}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={t.stops_title} />
          <div className="mx-auto mt-8 max-w-4xl">
            <Lightbox src="/images/tour-programme.webp" alt={t.stops_title}>
              <Image
                src="/images/tour-programme.webp"
                alt={t.stops_title}
                width={1800}
                height={1000}
                className="h-auto w-full rounded-2xl bg-white"
                sizes="100vw"
              />
            </Lightbox>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={t.events_title} />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {pastEvents.map((event, i) => (
              <Reveal key={`event-${i}`} delay={i * 0.06}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-semibold">{event.name[locale]}</h3>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </span>
                    <span>{event.date}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button render={<Link href={withLocale(locale, "/contact")}>{t.events_cta}</Link>} />
          </div>
        </div>
      </section>

      {/* Polar Steps */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding text-center">
          <SectionHeading title={t.polar_title} subtitle={t.polar_body} />
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-border bg-card p-8">
            <p className="leading-relaxed text-muted-foreground">
              {t.polar_tracking_before}{" "}
              <a
                href={POLAR_STEPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Polar Steps
              </a>
              {t.polar_tracking_after}
            </p>
          </div>
        </div>
      </section>

      {/* Tour Map */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding text-center">
          <SectionHeading title={t.map_title} subtitle={t.map_subtitle} />
          <div className="mx-auto mt-8 max-w-4xl">
            <Lightbox src="/images/tour-stops.webp" alt={t.map_title}>
              <Image
                src="/images/tour-stops.webp"
                alt={t.map_title}
                width={1800}
                height={1200}
                className="h-auto w-full rounded-2xl bg-white"
                sizes="100vw"
              />
            </Lightbox>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container-premium section-padding">
          <SectionHeading title={t.awareness_title} subtitle={t.awareness_body} />
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={t.invite_title}
        body={t.invite_body}
        buttonLabel={t.invite_cta}
        href="/contact"
      />
    </>
  );
}
