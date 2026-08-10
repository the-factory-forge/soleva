import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { habitatContent } from "@/lib/data/habitat";
import { services } from "@/lib/data/services";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/le-van/")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) =>
    metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${ loaderData.dict.meta.van.title } | ${SITE_NAME}`,
        description: loaderData.dict.meta.van.description,
        path: "/le-van",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    ),
  component: VanPage,
});

function VanPage() {
  const { locale, dict } = Route.useLoaderData();

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.van, href: "/le-van" }]}
        eyebrow={dict.van.hero.eyebrow}
        title={dict.van.hero.title}
        subtitle={dict.van.hero.subtitle}
      />

      <section className="bg-background">
        <div className="container-premium section-padding">
          <div className="flex flex-col gap-16">
            {services.map((service, i) => {
              const content = service.content[locale];
              const Icon = service.icon;
              const reversed = i % 2 === 1;
              return (
                <Reveal key={service.slug}>
                  <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                    <div className={reversed ? "lg:order-2" : ""}>
                      <Lightbox src={service.heroImage || "/placeholder.svg"} alt={content.title}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                          <Image
                            src={service.heroImage || "/placeholder.svg"}
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      </Lightbox>
                    </div>
                    <div className={reversed ? "lg:order-1" : ""}>
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h2 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">
                        {content.title}
                      </h2>
                      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                        {content.fullDescription}
                      </p>
                      <ul className="mt-6 flex flex-col gap-2">
                        {content.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={withLocale(locale, `/le-van/${service.slug}`)}
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {dict.van.explore}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Habitat feature banner */}
      <section className="bg-accent">
        <div className="container-premium section-padding">
          <Reveal>
            <Link
              href={withLocale(locale, "/habitat")}
              className="group grid items-stretch overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={IMAGES.habitatHero || "/placeholder.svg"}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
                  {habitatContent[locale].hero.eyebrow}
                </span>
                <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
                  {habitatContent[locale].hero.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {habitatContent[locale].hero.subtitle}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {dict.common.learn_more}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

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
