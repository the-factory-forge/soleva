import type { QueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";

import { DefaultNotFound } from "#/components/default-not-found";
import { PublicShell } from "#/components/layouts/public-shell";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Footer, type SocialLink } from "@/components/navigation/footer";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { CONTACT, SOCIALS, SITE_NAME } from "@/lib/constants";
import { getFooterProps } from "@/lib/footer-helpers";
import { type Dictionary, getDictionary, t } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";

const intranet = Object.values(
  import.meta.glob<{
    load: (queryClient: QueryClient) => Promise<boolean>;
    Shell: typeof PublicShell;
  }>("/src/intranet/site-shell.tsx", { eager: true }),
)[0];
const SiteShell = intranet?.Shell ?? PublicShell;

function buildFooterProps(locale: Locale, dict: Dictionary, authEnabled: boolean) {
  return getFooterProps({
    siteName: SITE_NAME,
    description: dict.footer.description,
    logo: "/images/soleva-logo.webp",
    columns: [
      {
        title: dict.footer.project,
        links: [
          { label: dict.nav.about, href: withLocale(locale, "/a-propos") },
          { label: dict.nav.equipe, href: withLocale(locale, "/equipe") },
          { label: dict.nav.partenaires, href: withLocale(locale, "/partenaires") },
        ],
      },
      {
        title: dict.footer.van,
        links: [
          { label: dict.nav.conversion, href: withLocale(locale, "/le-van/conversion-electrique") },
          { label: dict.nav.solaire, href: withLocale(locale, "/le-van/systeme-solaire") },
          { label: dict.nav.habitat, href: withLocale(locale, "/habitat") },
          { label: dict.nav.impact, href: withLocale(locale, "/impact") },
        ],
      },
      {
        title: dict.nav.actualites,
        links: [
          { label: dict.nav.voyage, href: withLocale(locale, "/voyage") },
          { label: dict.nav.blog, href: withLocale(locale, "/blog") },
          { label: dict.nav.presse, href: withLocale(locale, "/presse") },
          { label: dict.nav.evenements, href: withLocale(locale, "/evenements") },
        ],
      },
      {
        title: dict.nav.support,
        links: [
          { label: dict.nav.support, href: withLocale(locale, "/soutenir") },
          { label: dict.nav.sponsoring, href: withLocale(locale, "/sponsoring") },
          { label: dict.nav.crowdfunding, href: withLocale(locale, "/crowdfunding") },
        ],
      },
    ],
    contact: {
      title: dict.footer.contact,
      address: `${CONTACT.address.street}, ${CONTACT.address.zip} ${CONTACT.address.city}`,
      phone: CONTACT.phone,
      email: CONTACT.email,
    },
    socials: Object.entries(SOCIALS).map(([platform, url]) => ({
      platform: platform as SocialLink["platform"],
      url,
    })),
    copyright: `© {year} {name}. {rights}`,
    rights: dict.footer.rights,
    legalLinks: [
      ...(authEnabled ? [{ label: t(dict, "auth.signIn"), href: `/${locale}/intranet` }] : []),
      { label: dict.breadcrumb.legal, href: withLocale(locale, "/mentions-legales") },
      { label: dict.breadcrumb.privacy, href: withLocale(locale, "/confidentialite") },
      { label: dict.directory.title, href: withLocale(locale, "/plan-du-site") },
    ],
    attribution: {
      text: dict.footer.produced_by,
      href: "https://the-corner.io/portfolio/forge",
      logo: "https://assets.the-corner.io/logos/the_corner-icon.png",
    },
    manageCookiesEvent: "soleva:open-cookie-settings",
    variant: "dark",
    accentColor: "primary",
  });
}

export const Route = createFileRoute("/_site/$lang")({
  loader: async ({ location, context }) => {
    // WORKAROUND: params are not parsed for leading-param routes in this
    // TanStack version - derive the locale from the pathname instead.
    const raw = (location.pathname.match(/^\/([^/]+)/) ?? [])[1] ?? "";
    if (!isLocale(raw)) {
      throw notFound();
    }
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    const authEnabled = (await intranet?.load(context.queryClient)) ?? false;
    return { locale, dict, authEnabled };
  },
  head: async ({ loaderData }) => {
    if (loaderData) await getDictionary(loaderData.locale);
    return {};
  },
  notFoundComponent: DefaultNotFound,
  component: LangLayout,
});

function LangLayout() {
  const { locale, dict, authEnabled } = Route.useLoaderData();

  return (
    <div lang={locale}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t(dict, "a11y.skipToContent")}
      </a>
      <SiteShell locale={locale}>
        <main id="main-content" lang={locale}>
          <Outlet />
        </main>
        <Footer
          {...buildFooterProps(locale, dict, authEnabled)}
          manageCookiesLabel={t(dict, "footer.manage_cookies")}
        />
      </SiteShell>
      <CookieBanner locale={locale} dict={dict} showMarketing />
      <OrganizationJsonLd locale={locale} dict={dict} />
    </div>
  );
}
