import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DefaultNotFound } from "#/components/default-not-found";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Footer, type SocialLink } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { CONTACT, SOCIALS, SITE_NAME } from "@/lib/constants";
import { getFooterProps } from "@/lib/footer-helpers";
import { type Dictionary, getDictionary, t } from "@/lib/i18n";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";

function buildFooterProps(locale: Locale, dict: Dictionary) {
  return getFooterProps({
    siteName: SITE_NAME,
    description: dict.footer.description,
    logo: "/images/soleva-logo.webp",
    columns: [
      {
        title: dict.footer.explore,
        links: [
          { label: dict.nav.about, href: withLocale(locale, "/a-propos") },
          { label: dict.nav.voyage, href: withLocale(locale, "/voyage") },
          { label: dict.nav.support, href: withLocale(locale, "/soutenir") },
          { label: dict.nav.faq, href: withLocale(locale, "/faq") },
          { label: dict.nav.contact, href: withLocale(locale, "/contact") },
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
      { label: dict.breadcrumb.legal, href: withLocale(locale, "/mentions-legales") },
      { label: dict.breadcrumb.privacy, href: withLocale(locale, "/confidentialite") },
    ],
    attribution: {
      text: dict.footer.produced_by,
      href: "https://the-corner.io/portfolio/forge",
      logo: "https://assets.the-corner.io/logos/the_corner-icon.png",
    },
    manageCookiesEvent: "soleva:open-cookie-settings",
    variant: "dark",
    accentColor: "primary-soft",
  });
}

export const Route = createFileRoute("/_site/$lang")({
  loader: async ({ location }) => {
    // WORKAROUND: params are not parsed for leading-param routes in this
    // TanStack version - derive the locale from the pathname instead.
    const raw = (location.pathname.match(/^\/([^/]+)/) ?? [])[1] ?? "";
    if (!isLocale(raw)) {
      const rest = location.pathname.replace(/^\/[^/]+/, "");
      throw redirect({ href: `/${defaultLocale}${rest}` });
    }
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  notFoundComponent: DefaultNotFound,
  component: LangLayout,
});

function LangLayout() {
  const { locale, dict } = Route.useLoaderData();

  return (
    <div lang={locale}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t(dict, "a11y.skipToContent")}
      </a>
      <Navbar locale={locale} dict={dict} />
      <main id="main-content" lang={locale}>
        <Outlet />
      </main>
      <Footer
        {...buildFooterProps(locale, dict)}
        manageCookiesLabel={t(dict, "footer.manage_cookies")}
      />
      <CookieBanner locale={locale} dict={dict} showMarketing />
      <OrganizationJsonLd locale={locale} dict={dict} />
    </div>
  );
}
