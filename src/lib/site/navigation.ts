import { getFooterProps as getFooterPropsHelper } from "@/lib/footer-helpers";
import type { Dictionary } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL, CONTACT, SOCIALS } from "@/lib/site/constants";
import { services } from "@/lib/site/services";

export function getNavItems(locale: Locale, dict: Dictionary) {
  const base = `/${locale}`;
  return [
    { label: t(dict, "nav.home"), href: base },
    { label: t(dict, "nav.about"), href: `${base}/about` },
    {
      label: t(dict, "nav.services"),
      href: `${base}/services`,
      children: services.map((s, i) => ({
        label: t(dict, `services.items.${i}.title`),
        href: `${base}/services/${s.slug}`,
      })),
    },
    { label: t(dict, "nav.pricing"), href: `${base}/pricing` },
    { label: t(dict, "nav.faq"), href: `${base}/faq` },
    { label: t(dict, "nav.contact"), href: `${base}/contact` },
  ];
}

export function getNavbarProps(locale: Locale, dict: Dictionary) {
  const base = `/${locale}`;
  return {
    logo: { alt: SITE_NAME, href: base },
    items: getNavItems(locale, dict),
    cta: {
      label: t(dict, "nav.contact"),
      href: `${base}/contact`,
    },
    siteName: SITE_NAME,
    menuLabel: "Menu",
    languageLabel: t(dict, "common.language"),
    closeLabel: t(dict, "common.close"),
    navLabel: t(dict, "common.navLabel"),
    mobileNavLabel: t(dict, "common.mobileNavLabel"),
  };
}

export function getFooterProps(locale: Locale, dict: Dictionary) {
  const base = `/${locale}`;

  return getFooterPropsHelper({
    siteName: SITE_NAME,
    description: t(dict, "footer.description"),
    columns: [
      {
        title: t(dict, "nav.services"),
        links: services.map((s, i) => ({
          label: t(dict, `services.items.${i}.title`),
          href: `${base}/services/${s.slug}`,
        })),
      },
      {
        title: t(dict, "footer.explore"),
        links: [
          { label: t(dict, "nav.about"), href: `${base}/about` },
          { label: t(dict, "nav.pricing"), href: `${base}/pricing` },
          { label: t(dict, "nav.faq"), href: `${base}/faq` },
          { label: t(dict, "nav.contact"), href: `${base}/contact` },
        ],
      },
    ],
    contact: {
      title: t(dict, "footer.contact"),
      address: CONTACT.address,
      phone: CONTACT.phone,
      email: CONTACT.email,
      mapsUrl: CONTACT.mapsUrl,
      hours: t(dict, "footer.hours"),
    },
    socials: Object.entries(SOCIALS).map(([platform, url]) => ({
      platform: platform as
        | "instagram"
        | "facebook"
        | "linkedin"
        | "youtube"
        | "x"
        | "tiktok"
        | "whatsapp",
      url,
    })),
    copyright: t(dict, "footer.copyright"),
    rights: t(dict, "footer.rights"),
    legalLinks: [
      { label: t(dict, "footer.legal"), href: `${base}/legal/mentions` },
      { label: t(dict, "footer.privacy"), href: `${base}/legal/privacy` },
      { label: t(dict, "footer.terms"), href: `${base}/legal/cgv` },
    ],
    attribution: {
      text: t(dict, "footer.madeBy"),
      href: "https://the-corner.io/",
      logo: "https://assets.the-corner.io/logos/the_corner-icon.png",
    },
  });
}
