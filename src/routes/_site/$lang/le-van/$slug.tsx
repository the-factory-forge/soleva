import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Home } from "lucide-react";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { PageHero } from "@/components/layout/page-hero";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { PillarSuggestions } from "@/components/ui/pillar-suggestions";
import { SITE_NAME, SITE_URL, srcSetFor } from "@/lib/constants";
import { habitatContent } from "@/lib/data/habitat";
import { getRelatedServices, getServiceBySlug } from "@/lib/data/services";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/le-van/$slug")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const slug = location.pathname.split("/")[3] ?? "";
    const service = getServiceBySlug(slug);
    if (!service) throw notFound();
    const dict = await getDictionary(locale);
    // NOTE: never put `service` in loaderData - it contains React components
    // (Lucide icons) that break Seroval serialization (Symbol(react.forward_ref)).
    return { locale, dict, slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const dict = loaderData.dict;
    const service = getServiceBySlug(loaderData.slug);
    if (!service) throw notFound();
    const content = service.content[loaderData.locale];
    return metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${content.title} | ${SITE_NAME}`,
        description: content.shortDescription,
        path: `/le-van/${service.slug}`,
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { locale, dict, slug } = Route.useLoaderData();
  const service = getServiceBySlug(slug);
  if (!service) throw notFound();
  const content = service.content[locale];
  const related = service.relatedServices
    .map((relSlug) => {
      const svc = getServiceBySlug(relSlug);
      if (svc) {
        const c = svc.content[locale];
        return {
          key: relSlug,
          href: `/le-van/${relSlug}`,
          icon: svc.icon,
          title: c.title,
          description: c.shortDescription,
        };
      }
      // habitat is a dedicated rich page (not a /le-van service)
      if (relSlug === "habitat") {
        return {
          key: "habitat",
          href: "/habitat",
          icon: Home,
          title: dict.breadcrumb.habitat,
          description: habitatContent[locale].hero.subtitle,
        };
      }
      return null;
    })
    .filter((rel): rel is NonNullable<typeof rel> => rel !== null);
  const Icon = service.icon;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={t(dict, "breadcrumb.ariaLabel")}
        homeLabel={dict.breadcrumb.home}
        crumbs={[
          { label: dict.breadcrumb.van, href: "/le-van" },
          { label: content.shortTitle, href: `/le-van/${slug}` },
        ]}
        eyebrow={dict.breadcrumb.van}
        title={content.title}
        subtitle={content.shortDescription}
      />

      <FaqJsonLd items={content.faqs} />

      {/* Overview */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Lightbox src={service.heroImage || "/placeholder.svg"} alt={content.title}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={service.heroImage || "/placeholder.svg"}
                    alt=""
                    fill
                    srcSet={srcSetFor(service.heroImage)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </Lightbox>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">
                  {content.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                  {content.fullDescription}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-premium space-y-12 section-padding">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            {dict.service_detail.diagrams_title}
          </h2>
          {content.diagrams.map((diagram) => (
            <figure key={diagram.image} className="space-y-4">
              <h3 className="font-heading text-xl font-semibold">{diagram.title}</h3>
              <Lightbox src={diagram.image} alt={diagram.title}>
                <Image
                  src={diagram.image}
                  alt={diagram.title}
                  width={1800}
                  height={1050}
                  className="h-auto w-full rounded-2xl bg-white"
                  sizes="100vw"
                />
              </Lightbox>
              <figcaption className="max-w-4xl leading-relaxed text-muted-foreground">
                {diagram.description}
              </figcaption>
            </figure>
          ))}
          {service.gallery && (
            <div>
              <h3 className="font-heading text-xl font-semibold">
                {dict.service_detail.gallery_title}
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {service.gallery.map((src, index) => (
                  <Lightbox key={src} src={src} alt={`${content.title} — ${index + 1}`}>
                    <Image
                      src={src}
                      alt={`${content.title} — ${index + 1}`}
                      width={800}
                      height={600}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </Lightbox>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              {dict.service_detail.features_title}
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.features.map((feature, i) => (
              <Reveal key={`feature-${i}`} delay={i * 0.05}>
                <li className="flex items-start gap-3 rounded-2xl bg-card p-5 shadow-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90">{feature}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              {dict.service_detail.process_title}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <li className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                  <span className="font-heading text-4xl font-bold text-primary/20">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              {dict.service_detail.faq_title}
            </h2>
          </Reveal>
          <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4">
            {content.faqs.map((faq, i) => (
              <Reveal key={`faq-${i}`} delay={i * 0.05}>
                <details className="group rounded-2xl border border-border bg-card p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {faq.question}
                    <span
                      className="ml-4 text-primary transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && <PillarSuggestions locale={locale} dict={dict} items={related} />}

      <p className="container-premium pb-6 text-center text-xs text-muted-foreground">
        {dict.service_detail.disclaimer}
      </p>

      <CtaBand
        locale={locale}
        title={dict.service_detail.cta_title}
        body={dict.service_detail.cta_body}
        buttonLabel={dict.common.contact_us}
        href="/contact"
      />
    </>
  );
}
