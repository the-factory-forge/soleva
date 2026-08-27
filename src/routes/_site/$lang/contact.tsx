import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Share2 } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { CONTACT, SOCIALS, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/$lang/contact")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) =>
    metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${loaderData.dict.meta.contact.title} | ${SITE_NAME}`,
        description: loaderData.dict.meta.contact.description,
        path: "/contact",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    ),
  component: ContactPage,
});

function ContactPage() {
  const { locale, dict } = Route.useLoaderData();
  const t = dict.contact;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.contact, href: "/contact" }]}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
                {t.emailCTA.title}
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">{t.emailCTA.description}</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className={cn(buttonVariants({ size: "lg" }), "mt-6 gap-2")}
              >
                <Mail className="h-5 w-5" />
                {CONTACT.email}
              </a>
            </div>

            <aside className="flex flex-col gap-8">
              <h2 className="font-heading text-xl font-bold text-foreground">{t.info.title}</h2>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.info.email_label}</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.info.location_label}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {CONTACT.address.street}
                    {"\n"}
                    {CONTACT.address.zip} {CONTACT.address.city}
                    {"\n"}
                    {CONTACT.address.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.info.follow_label}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <a
                      href={SOCIALS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      Instagram
                    </a>
                    <a
                      href={SOCIALS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      Facebook
                    </a>
                    <a
                      href={SOCIALS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                <iframe
                  src={`https://maps.google.com/maps?q=${CONTACT.geo.latitude},${CONTACT.geo.longitude}&z=15&output=embed`}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.info.location_label}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
