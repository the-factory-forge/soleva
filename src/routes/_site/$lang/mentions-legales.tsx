import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/layout/page-hero";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/mentions-legales")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) => {
    const dict = loaderData!.dict;
    return     metadataToHead(
      buildMetadata({
        locale: loaderData!.locale,
        title: `${dict.meta.legal.title} | ${SITE_NAME}`,
        description: dict.meta.legal.description,
        path: "/mentions-legales",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
        noIndex: true,
      }),
    );
  },
  component: LegalPage,
});

function LegalPage() {
  const { locale, dict } = Route.useLoaderData();
  const lg = dict.legal;

  const sections = [
    { title: lg.editor_title, body: lg.editor_body },
    { title: lg.form_title, body: lg.form_body },
    { title: lg.hosting_title, body: lg.hosting_body },
    { title: lg.credits_title, body: lg.credits_body },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={t(dict, "breadcrumb.ariaLabel")}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.legal, href: "/mentions-legales" }]}
        title={lg.title}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-heading text-xl font-bold">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
            <p className="rounded-2xl border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
              {lg.todo}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
