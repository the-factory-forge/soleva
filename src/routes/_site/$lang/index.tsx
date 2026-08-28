import { createFileRoute } from "@tanstack/react-router";
import { Aperture, Camera } from "lucide-react";

import { HomeFigures } from "@/components/home/home-figures";
import { HomeHero } from "@/components/home/home-hero";
import { HomePillars } from "@/components/home/home-pillars";
import { HomeProblem } from "@/components/home/home-problem";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Link } from "@/components/ui/link";
import { FadeUp as Reveal } from "@/components/animations-lazy";
import { IMAGES, PARTNER_LOGOS, SITE_NAME, SITE_URL, srcSetFor } from "@/lib/constants";
import { partnerCategories } from "@/lib/data/partners";
import { ensureDictionary, useDictionary } from "@/lib/i18n/use-dictionary";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

const TECHNICAL_LOGO_MAP: Record<string, string> = {
  CSEM: PARTNER_LOGOS.csem,
  "EPFL PV-Lab": PARTNER_LOGOS.epfl,
  "Studer Innotec": PARTNER_LOGOS.studer,
  "BRUSA HyPower": PARTNER_LOGOS.brusa,
};

const INSTITUTIONAL_LOGO_MAP: Record<string, string> = {
  "Canton de Vaud": PARTNER_LOGOS.cantonVaud,
  "Services industriels de Lausanne (SiL)": PARTNER_LOGOS.sil,
};

const AWARDS_LOGO_MAP: Record<string, string> = {
  "Energy Lab Winner 2022": PARTNER_LOGOS.energyLab,
};

export const Route = createFileRoute("/_site/$lang/")({
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
        title: `${dict.meta.home.title} | ${SITE_NAME}`,
        description: dict.meta.home.description,
        path: "/",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: HomePage,
});

function HomePage() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);

  return (
    <>
      <HomeHero locale={locale} dict={dict} />
      <HomeProblem locale={locale} dict={dict} />
      <HomePillars locale={locale} dict={dict} />
      <HomeFigures locale={locale} dict={dict} />

      {/* Nouveau départ */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Lightbox src={IMAGES.workshop} alt="">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={IMAGES.workshop}
                    alt=""
                    fill
                    srcSet={srcSetFor(IMAGES.workshop)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Lightbox>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Aperture className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">
                  {dict.home.new_start.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {dict.home.new_start.body}
                </p>
                <p className="mt-4 font-medium text-foreground">{dict.home.new_start.subtitle}</p>
                <Button
                  className="mt-6"
                  size="lg"
                  render={
                    <Link href={withLocale(locale, "/soutenir")}>{dict.home.new_start.cta}</Link>
                  }
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              {dict.home.partners.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center leading-relaxed text-muted-foreground">
              {dict.home.partners.subtitle}
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {/* Partenaires techniques */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">
                {dict.home.partners.technical}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {partnerCategories
                  .find((c) => c.key === "technical")
                  ?.partners.map((item, i) => {
                    const logo = TECHNICAL_LOGO_MAP[item.name];
                    return (
                      <Reveal key={`partner-technical-${i}`} delay={i * 0.06}>
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5">
                          <div className="relative h-16 w-28">
                            <Image
                              src={logo || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                              sizes="112px"
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{item.name}</span>
                        </div>
                      </Reveal>
                    );
                  })}
              </div>
            </div>

            {/* Soutiens institutionnels */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">
                {dict.home.partners.institutional}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {partnerCategories
                  .find((c) => c.key === "institutional")
                  ?.partners.map((item, i) => {
                    const logo = INSTITUTIONAL_LOGO_MAP[item.name];
                    return (
                      <Reveal key={`partner-institutional-${i}`} delay={i * 0.06}>
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5">
                          <div className="relative h-16 w-28">
                            <Image
                              src={logo || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                              sizes="112px"
                            />
                          </div>
                          <span className="text-center text-sm font-semibold text-foreground">
                            {item.name}
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
              </div>
            </div>

            {/* Prix */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">
                {dict.home.partners.awards}
              </h3>
              <div className="mt-4">
                {partnerCategories
                  .find((c) => c.key === "awards")
                  ?.partners.map((item, i) => {
                    const logo = AWARDS_LOGO_MAP[item.name];
                    return (
                      <Reveal key={`partner-awards-${i}`}>
                        <div className="mx-auto flex max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
                          <div className="relative h-16 w-28">
                            <Image
                              src={logo || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                              sizes="112px"
                            />
                          </div>
                          <span className="text-center text-sm font-bold text-secondary">
                            {item.name}
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentaire */}
      <section className="bg-dark text-dark-foreground [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding text-center">
          <Reveal>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
              <Camera className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">
              {dict.home.documentary.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-dark-foreground/70">
              {dict.home.documentary.subtitle}
            </p>
            <div className="mx-auto mt-8 aspect-video max-w-3xl overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/6ScnYhFPv5w"
                title="Soleva - L'aventure Soleva"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={dict.home.cta.title}
        body={dict.home.cta.body}
        buttonLabel={dict.home.cta.button}
        href="/contact"
      />
    </>
  );
}
