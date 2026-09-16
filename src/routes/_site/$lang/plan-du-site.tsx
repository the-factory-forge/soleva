import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHero } from "@/components/layout/page-hero";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";
import { STATIC_PATHS, PAGE_META_KEYS } from "@/lib/site/paths";

export const Route = createFileRoute("/_site/$lang/plan-du-site")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    return { locale, dict: await getDictionary(locale) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${loaderData.dict.directory.title} | ${SITE_NAME}`,
        description: loaderData.dict.directory.description,
        path: "/plan-du-site",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: DirectoryPage,
});

function DirectoryPage() {
  const { locale, dict } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const pages = [
    ...STATIC_PATHS.filter((path) => path !== "/plan-du-site").map((path) => ({
      path,
      title: dict.meta[PAGE_META_KEYS[path] ?? path.slice(1)].title,
      description: dict.meta[PAGE_META_KEYS[path] ?? path.slice(1)].description,
    })),
    ...services.map((service) => ({
      path: `/le-van/${service.slug}`,
      title: service.content[locale].title,
      description: service.content[locale].shortDescription,
    })),
  ];
  const matching = pages.filter((page) =>
    `${page.title} ${page.description}`
      .toLocaleLowerCase(locale)
      .includes(search.trim().toLocaleLowerCase(locale)),
  );

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        crumbs={[{ label: dict.directory.title, href: "/plan-du-site" }]}
        title={dict.directory.title}
        subtitle={dict.directory.description}
      />
      <section className="bg-background">
        <div className="container-premium section-padding">
          <label htmlFor="page-search" className="mb-2 block font-semibold">
            {dict.directory.search}
          </label>
          <Input
            id="page-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {matching.map((page) => (
              <li key={page.path}>
                <Link
                  href={withLocale(locale, page.path || "/")}
                  className="block h-full rounded-2xl border border-border p-6 transition-colors hover:border-primary"
                >
                  <h2 className="font-heading text-lg font-semibold">{page.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{page.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          {matching.length === 0 && (
            <p role="status" className="mt-6">
              {dict.directory.empty}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
