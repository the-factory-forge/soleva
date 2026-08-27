import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TourMap } from "@/components/voyage/tour-map";
import { IMAGES, KEY_FIGURES, SITE_NAME, SITE_URL, srcSetFor } from "@/lib/constants";
import { POLAR_STEPS_URL, pastEvents } from "@/lib/data/events";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

const STOPS = ["Lausanne", "Genève", "Sion", "Lugano", "Davos", "Zürich", "Basel", "Bern"];

export const Route = createFileRoute("/_site/$lang/voyage")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) =>
    metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${loaderData.dict.meta.voyage.title} | ${SITE_NAME}`,
        description: loaderData.dict.meta.voyage.description,
        path: "/voyage",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    ),
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
                <dl className="mt-8 grid grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-muted p-5">
                    <dt className="text-sm text-muted-foreground">{dict.home.figures.communes}</dt>
                    <dd className="mt-1 font-heading text-3xl font-extrabold text-primary">
                      {KEY_FIGURES.communesVisited}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-muted p-5">
                    <dt className="text-sm text-muted-foreground">{dict.home.figures.autonomy}</dt>
                    <dd className="mt-1 font-heading text-3xl font-extrabold text-primary">
                      {KEY_FIGURES.autonomy}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={t.stops_title} />
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
            {STOPS.map((stop, i) => (
              <Reveal key={stop} delay={i * 0.04}>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
                  {stop}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={t.events_title} />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {pastEvents.map((event, i) => (
              <Reveal key={event.name[locale]} delay={i * 0.06}>
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
              Retrouvez le suivi en direct sur{" "}
              <a
                href={POLAR_STEPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Polar Steps
              </a>
              . L'application mobile permet de suivre la position du van en temps réel pendant le
              tour.
            </p>
          </div>
        </div>
      </section>

      {/* Tour Map */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding text-center">
          <SectionHeading
            title="Carte du tour"
            subtitle="De Lausanne à Zurich, en passant par Davos, Lugano et Sion."
          />
          <div className="mx-auto mt-8 max-w-4xl">
            <TourMap />
          </div>
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
