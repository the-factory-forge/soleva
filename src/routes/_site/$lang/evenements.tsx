import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Link } from "@/components/ui/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { pastEvents } from "@/lib/data/events";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/evenements")({
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
        title: `${dict.meta.evenements.title} | ${SITE_NAME}`,
        description: dict.meta.evenements.description,
        path: "/evenements",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: EventsPage,
});

function EventsPage() {
  const { locale, dict } = Route.useLoaderData();
  const ev = dict.evenements;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.evenements, href: "/evenements" }]}
        eyebrow={ev.hero.eyebrow}
        title={ev.hero.title}
        subtitle={ev.hero.subtitle}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
            {ev.intro}
          </p>

          <div className="mt-12">
            <SectionHeading title={ev.past_title} />
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {pastEvents.map((event, i) => (
              <Reveal key={`event-${i}`} delay={i * 0.06}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-semibold">{event.name[locale]}</h3>
                  {i === 0 && (
                    <Link
                      className="mt-3 inline-block text-sm text-primary underline"
                      href={withLocale(
                        locale,
                        "/blog#solar-openair-cinema-soleva-documentary-unveiling",
                      )}
                    >
                      {dict.common.learn_more}
                    </Link>
                  )}
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
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={ev.cta.title}
        body={ev.cta.body}
        buttonLabel={ev.cta.button}
        href="/contact"
      />
    </>
  );
}
