import { createFileRoute } from "@tanstack/react-router";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { blogPosts } from "@/lib/data/blog";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

export const Route = createFileRoute("/_site/$lang/blog")({
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
        title: `${dict.meta.blog.title} | ${SITE_NAME}`,
        description: dict.meta.blog.description,
        path: "/blog",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: BlogPage,
});

function BlogPage() {
  const { locale, dict } = Route.useLoaderData();
  const t = dict.blog;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.blog, href: "/blog" }]}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={IMAGES.journey}
      />

      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <p className="mx-auto max-w-2xl text-center leading-relaxed text-muted-foreground">
            {t.intro}
          </p>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <article
                  id={post.slug}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
                >
                  <span className="inline-flex self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary">
                    {post.date}
                  </span>
                  <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {post.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt[locale]}
                  </p>
                  {post.body && (
                    <details className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      <summary className="cursor-pointer font-semibold text-secondary">
                        {dict.common.learn_more}
                      </summary>
                      <div className="mt-3 space-y-3">
                        {post.body[locale].map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </details>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={t.cta.title}
        body={t.cta.body}
        buttonLabel={dict.common.contact_us}
        href="/contact"
      />
    </>
  );
}
