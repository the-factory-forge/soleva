import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Handshake, Heart, Share2, Users } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { CopyIbanButton } from "@/components/ui/copy-iban-button";
import { CtaBand } from "@/components/ui/cta-band";
import { Lightbox } from "@/components/ui/lightbox";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShareButton } from "@/components/ui/share-button";
import { DONATION, IMAGES, KEY_FIGURES, SITE_NAME, SITE_URL, srcSetFor } from "@/lib/constants";
import { sponsorTiers } from "@/lib/data/sponsor-tiers";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/soutenir")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) =>
    metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${loaderData.dict.meta.support.title} | ${SITE_NAME}`,
        description: loaderData.dict.meta.support.description,
        path: "/soutenir",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    ),
  component: SupportPage,
});

function SupportPage() {
  const { locale, dict } = Route.useLoaderData();
  const t = dict.support;

  const ways = [
    {
      icon: Heart,
      title: t.ways.donate_title,
      desc: t.ways.donate_desc,
      cta: t.ways.donate_cta,
      href: "#donation",
    },
    {
      icon: Handshake,
      title: t.ways.sponsor_title,
      desc: t.ways.sponsor_desc,
      cta: t.ways.sponsor_cta,
      href: "#sponsorship",
    },
    {
      icon: Users,
      title: t.ways.volunteer_title,
      desc: t.ways.volunteer_desc,
      cta: t.ways.volunteer_cta,
      href: "/contact",
    },
    {
      icon: Share2,
      title: t.ways.share_title,
      desc: t.ways.share_desc,
      cta: t.ways.share_cta,
      href: null,
    },
  ];

  const cf = t.crowdfunding;

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.support, href: "/soutenir" }]}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={IMAGES.support}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid gap-6 md:grid-cols-2">
            {ways.map((way, i) => {
              const Icon = way.icon;
              return (
                <Reveal key={way.title} delay={i * 0.06}>
                  <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 font-heading text-xl font-bold text-foreground">
                      {way.title}
                    </h2>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                      {way.desc}
                    </p>
                    {way.cta && way.href ? (
                      <Link
                        href={way.href.startsWith("#") ? way.href : withLocale(locale, way.href)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {way.cta}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    ) : way.cta ? (
                      <ShareButton label={way.cta} />
                    ) : null}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sponsoring Tiers */}
      <section
        id="sponsorship"
        className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]"
      >
        <div className="container-premium section-padding">
          <SectionHeading title={t.sponsor_tiers_title} subtitle={t.sponsor_tiers_subtitle} />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {sponsorTiers.map((tier, i) => {
              const colors = [
                "border-muted-foreground/30 bg-muted/50",
                "border-secondary/40 bg-secondary/5",
                "border-primary/30 bg-primary/5",
              ];
              const badges = [
                "bg-muted-foreground/10 text-muted-foreground",
                "bg-secondary/15 text-secondary",
                "bg-primary/10 text-primary",
              ];
              return (
                <Reveal key={tier.key} delay={i * 0.08}>
                  <div className={`flex h-full flex-col rounded-3xl border ${colors[i]} p-8`}>
                    <div
                      className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${badges[i]}`}
                    >
                      {tier.key}
                    </div>
                    <p className="mt-4 font-heading text-3xl font-extrabold">{tier.price}</p>
                    <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                      {t.sponsor_features}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features[locale].map((f, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={withLocale(locale, "/contact")}
                      className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {t.sponsor_cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-dark text-dark-foreground [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading inverted title={cf.title} subtitle={cf.body} />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: cf.goal, value: KEY_FIGURES.crowdfundingGoal },
              { label: cf.raised, value: KEY_FIGURES.crowdfundingAmount },
              { label: cf.percent, value: KEY_FIGURES.crowdfundingPercent },
              { label: cf.backers, value: String(KEY_FIGURES.crowdfundingBackers) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-dark-foreground/5 p-6 text-center">
                <p className="font-heading text-3xl font-extrabold text-secondary">{stat.value}</p>
                <p className="mt-2 text-sm text-dark-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              render={
                <a href={KEY_FIGURES.crowdfundingUrl} target="_blank" rel="noopener noreferrer">
                  {cf.link}
                </a>
              }
            />
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-dark-foreground/60 italic">
            {cf.todo}
          </p>
        </div>
      </section>

      {/* IBAN Donation */}
      <section
        id="donation"
        className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]"
      >
        <div className="container-premium section-padding">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
                {t.iban.title}
              </h2>
              <p className="mt-3 text-center leading-relaxed text-muted-foreground">
                {t.iban.body}
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="rounded-3xl border border-border bg-card p-8">
                <dl className="grid gap-4">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {t.iban.account_holder}
                    </dt>
                    <dd className="text-sm text-foreground">{DONATION.beneficiary}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {t.iban.address}
                    </dt>
                    <dd className="text-sm text-foreground">
                      {DONATION.addressLine1}, {DONATION.addressLine2}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {t.iban.iban_label}
                    </dt>
                    <dd className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">
                        {DONATION.ibanFormatted}
                      </span>
                      <CopyIbanButton iban={DONATION.iban} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {t.iban.bic_label}
                    </dt>
                    <dd className="font-mono text-sm text-foreground">{DONATION.bic}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {t.iban.bank_label}
                    </dt>
                    <dd className="text-sm text-foreground">{DONATION.bank}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-4">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {t.iban.description_label}
                    </dt>
                    <dd className="font-mono text-sm text-foreground">{DONATION.reference}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6">
                <Lightbox src="/images/qr-code.webp" alt="QR Code pour don bancaire Soleva">
                  <img
                    src="/images/qr-code.webp"
                    srcSet="/images/qr-code-480.webp 480w, /images/qr-code-800.webp 800w, /images/qr-code.webp 937w"
                    sizes="180px"
                    alt="QR Code pour don bancaire Soleva"
                    width={180}
                    height={180}
                    className="rounded-xl"
                  />
                </Lightbox>
                <p className="mt-3 text-center text-xs text-muted-foreground">Scannez pour payer</p>
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
