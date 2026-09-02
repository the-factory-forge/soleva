import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/layout/page-hero";
import { FadeUp as Reveal } from "@/components/animations-lazy";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { PRESS_LOGOS, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pressAppearances } from "@/lib/data/press";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/presse")({
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
        title: `${dict.meta.presse.title} | ${SITE_NAME}`,
        description: dict.meta.presse.description,
        path: "/presse",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: PressPage,
});

function PressPage() {
  const { locale, dict } = Route.useLoaderData();
  const p = dict.presse;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.presse, href: "/presse" }]}
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subtitle={p.hero.subtitle}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <SectionHeading title={p.title} subtitle={p.intro} />

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pressAppearances.map((item, i) => (
              <Reveal key={`press-${i}`} delay={i * 0.03}>
                <div className="flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
                  <div className="relative h-10 w-20">
                    <Image
                      src={PRESS_LOGOS[item.media] || "/placeholder.svg"}
                      alt={item.media}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <span className="font-heading text-xs font-bold">{item.media}</span>
                  <span className="text-xs text-muted-foreground">
                    {t(dict, `presse.pressTypes.${item.type}`)}
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    {item.date} · {item.language}
                  </span>
                  {item.linkStatus !== "broken" && item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline"
                      aria-label={`${p.read_label} ${item.media}`}
                    >
                      {p.read_label}
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
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
