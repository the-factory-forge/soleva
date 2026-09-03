import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock, Megaphone, Sun, Users } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { FadeUp as Reveal } from "@/components/animations-lazy";
import { CtaBand } from "@/components/ui/cta-band";
import { CtaExternal } from "@/components/ui/cta-button";
import { CopyIbanButton } from "@/components/ui/copy-iban-button";
import { Lightbox } from "@/components/ui/lightbox";
import { SectionHeading } from "@/components/ui/section-heading";
import { DONATION, IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/crowdfunding")({
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
        title: `${dict.meta.crowdfunding.title} | ${SITE_NAME}`,
        description: dict.meta.crowdfunding.description,
        path: "/crowdfunding",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: CrowdfundingPage,
});

// Story paragraph copied VERBATIM from the campaign success narrative in
// content-export/soleva.org/{fr,en}/crowdfunding.json. FR/EN mirror the source;
// DE/IT are faithful translations from the EN source (no DE/IT source exists).
// (The donation-essential sentence lives in the dictionary key
// dict.crowdfunding.donation_body, also copied verbatim per language.)
const STORY: Record<Locale, string> = {
  fr: "Grâce au grand soutien de plus de 130 contributeurs, notre campagne de crowdfunding au début du projet a été un plein succès. La campagne Wemakeit s'est déroulée pendant 1 mois en été 2022 et nous avons pu collecter près de 30'000.- pour commencer la construction du premier prototype de démonstration.",
  en: "Thanks to the great support of more than 130 contributors, our crowdfunding campaign at the beginning of the project was a full success. The Wemakeit campaign was running during 1 month in summer 2022 and we were able to collect almost 30'000.- to start the construction of our first demonstration vehicle.",
  // de: source EN (traduction)
  de: "Dank der grossen Unterstützung von über 130 Beitragenden war unsere Crowdfunding-Kampagne zu Beginn des Projekts ein voller Erfolg. Die Wemakeit-Kampagne lief 1 Monat im Sommer 2022 und wir konnten fast 30'000.- sammeln, um mit dem Bau des ersten Demonstrationsprototyps zu beginnen.",
  // it: source EN (traduction)
  it: "Grazie al grande sostegno di oltre 130 contributori, la nostra campagna di crowdfunding all'inizio del progetto è stata un pieno successo. La campagna Wemakeit si è svolta per 1 mese nell'estate 2022 e siamo riusciti a raccogliere quasi 30'000.- per iniziare la costruzione del primo prototipo dimostrativo.",
};

function CrowdfundingPage() {
  const { locale, dict } = Route.useLoaderData();
  const t = dict.crowdfunding;
  const iban = dict.support.iban;

  const facts = [
    { icon: Megaphone, label: t.facts.campaign, value: t.facts.campaign_value },
    { icon: Clock, label: t.facts.duration, value: t.facts.duration_value },
    { icon: Users, label: t.facts.contributors, value: t.facts.contributors_value },
    { icon: Sun, label: t.facts.raised, value: t.facts.raised_value },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.crowdfunding, href: "/crowdfunding" }]}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={IMAGES.support}
      />

      {/* Story - verbatim source paragraph */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={t.story_title} />
          <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            {STORY[locale]}
          </p>
        </div>
      </section>

      {/* Campaign facts */}
      <section className="bg-dark text-dark-foreground [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading inverted title={t.facts.title} />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {facts.map((fact, i) => {
              const Icon = fact.icon;
              return (
                <Reveal key={`fact-${i}`} delay={i * 0.06}>
                  <div className="flex h-full flex-col items-center rounded-2xl bg-dark-foreground/5 p-6 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <p className="mt-4 font-heading text-xl font-extrabold text-secondary">
                      {fact.value}
                    </p>
                    <p className="mt-2 text-sm text-dark-foreground/70">{fact.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <CtaExternal
              href="https://wemakeit.com/projects/soleva-solar-electric-van"
              variant="secondary"
              size="lg"
            >
              {t.cta_wemakeit}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CtaExternal>
          </div>
        </div>
      </section>

      {/* Video - crowdfunding presentation movie */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={t.video_title} />
          <div className="mx-auto mt-10 aspect-video max-w-3xl overflow-hidden rounded-2xl">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/ZGMaSStYKDw"
              title="Soleva - Crowdfunding"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-8 flex justify-center">
            <CtaExternal
              href="https://www.youtube.com/watch?v=6ScnYhFPv5w"
              variant="outline"
              size="lg"
            >
              {t.documentary_label}
            </CtaExternal>
          </div>
        </div>
      </section>

      {/* Donation / IBAN */}
      <section
        id="donation"
        className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]"
      >
        <div className="container-premium section-padding">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
                {t.donation_title}
              </h2>
              <p className="mt-3 text-center leading-relaxed text-muted-foreground">
                {t.donation_body}
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="rounded-3xl border border-border bg-card p-8">
                <dl className="grid gap-4">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {iban.account_holder}
                    </dt>
                    <dd className="text-sm text-foreground">{DONATION.beneficiary}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">{iban.address}</dt>
                    <dd className="text-sm text-foreground">
                      {DONATION.addressLine1}, {DONATION.addressLine2}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">{iban.iban_label}</dt>
                    <dd className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">
                        {DONATION.ibanFormatted}
                      </span>
                      <CopyIbanButton iban={DONATION.iban} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">{iban.bic_label}</dt>
                    <dd className="font-mono text-sm text-foreground">{DONATION.bic}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {iban.bank_label}
                    </dt>
                    <dd className="text-sm text-foreground">{DONATION.bank}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {iban.description_label}
                    </dt>
                    <dd className="font-mono text-sm text-foreground">{DONATION.reference}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6">
                <Lightbox src="/images/qr-code.webp" alt={dict.support.qr_alt}>
                  <img
                    src="/images/qr-code.webp"
                    srcSet="/images/qr-code-480.webp 480w, /images/qr-code-800.webp 800w, /images/qr-code.webp 937w"
                    sizes="180px"
                    alt={dict.support.qr_alt}
                    width={180}
                    height={180}
                    className="rounded-xl"
                  />
                </Lightbox>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {dict.support.scan_to_pay}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={t.sponsor_cta.title}
        body={t.sponsor_cta.body}
        buttonLabel={t.sponsor_cta.button}
        href="/sponsoring"
      />
    </>
  );
}
