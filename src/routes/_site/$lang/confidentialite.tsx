import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/layout/page-hero";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/confidentialite")({
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
        title: `${dict.meta.privacy.title} | ${SITE_NAME}`,
        description: dict.meta.privacy.description,
        path: "/confidentialite",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
        noIndex: true,
      }),
    );
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const { locale, dict } = Route.useLoaderData();
  const p = dict.privacy;

  const sections = [
    { title: p.controller_title, body: p.controller_body },
    { title: p.data_title, body: p.data_body },
    { title: p.logs_title, body: p.logs_body },
    { title: p.purposes_title, body: p.purposes_body },
    { title: p.analytics_title, body: p.analytics_body },
    { title: p.retention_title, body: p.retention_body },
    { title: p.rights_title, body: p.rights_body },
    { title: p.social_title, body: p.social_body },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={t(dict, "breadcrumb.ariaLabel")}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.privacy, href: "/confidentialite" }]}
        title={p.title}
        subtitle={p.intro}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-heading text-xl font-bold">{s.title}</h2>
                <p className="mt-2 leading-relaxed whitespace-pre-line text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">{p.updatedAt}</p>
          </div>
        </div>
      </section>
    </>
  );
}
