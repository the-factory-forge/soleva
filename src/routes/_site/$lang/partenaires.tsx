import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { FadeUp as Reveal } from "@/components/animations-lazy";
import { IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { partnerCategories, type Partner } from "@/lib/data/partners";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

type LogoVariant = "technical" | "institutional" | "awards";

// Replicates the home page partner logo-card markup, but links the whole card
// to the partner URL when one is present (with an external-link indicator).
function PartnerCard({ item, variant, label }: { item: Partner; variant: LogoVariant; label: string }) {
  const outer =
    variant === "awards"
      ? "mx-auto flex max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-5"
      : "flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5";
  const nameClass =
    variant === "awards"
      ? "text-center text-sm font-bold text-secondary"
      : variant === "institutional"
        ? "text-center text-sm font-semibold text-foreground"
        : "text-sm font-semibold text-foreground";
  const hoverClass = item.url ? "transition-colors hover:border-primary/60 hover:bg-card" : "";

  const inner = (
    <>
      <div className="relative h-16 w-28">
        <Image
          src={item.logo || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-contain"
          sizes="112px"
        />
      </div>
      <span className={nameClass}>{item.name}</span>
      {item.url ? (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {label}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  return item.url ? (
    <a
      href={item.url}
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

export const Route = createFileRoute("/_site/$lang/partenaires")({
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
        title: `${dict.meta.partenaires.title} | ${SITE_NAME}`,
        description: dict.meta.partenaires.description,
        path: "/partenaires",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: PartnersPage,
});

function PartnersPage() {
  const { locale, dict } = Route.useLoaderData();
  const p = dict.partenaires;

  const technical = partnerCategories.find((c) => c.key === "technical")?.partners ?? [];
  const institutional = partnerCategories.find((c) => c.key === "institutional")?.partners ?? [];
  const awards = partnerCategories.find((c) => c.key === "awards")?.partners ?? [];

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.partenaires, href: "/partenaires" }]}
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subtitle={p.hero.subtitle}
        image={IMAGES.workshop}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <p className="mx-auto max-w-2xl text-center leading-relaxed text-muted-foreground">
            {p.intro}
          </p>

          <div className="mt-12 space-y-10">
            {/* Partenaires techniques */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">
                {p.technical}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {technical.map((item, i) => (
                  <Reveal key={`partner-technical-${i}`} delay={i * 0.06}>
                    <PartnerCard item={item} variant="technical" label={p.external_label} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Soutiens institutionnels */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">
                {p.institutional}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {institutional.map((item, i) => (
                  <Reveal key={`partner-institutional-${i}`} delay={i * 0.06}>
                    <PartnerCard item={item} variant="institutional" label={p.external_label} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">
                {p.awards}
              </h3>
              <div className="mt-4">
                {awards.map((item, i) => (
                  <Reveal key={`partner-awards-${i}`}>
                    <PartnerCard item={item} variant="awards" label={p.external_label} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
