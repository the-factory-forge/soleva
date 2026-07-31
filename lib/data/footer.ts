import { type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n"
import { withLocale } from "@/lib/navigation"
import { CONTACT, SOCIALS, SITE_NAME, THE_CORNER } from "@/lib/constants"

export function getFooterProps(locale: Locale, dict: Dictionary) {
  const year = new Date().getFullYear()

  return {
    brand: {
      name: SITE_NAME,
      description: dict.footer.description,
      logo: "/images/soleva-logo.webp",
    },
    columns: [
      {
        title: dict.footer.explore,
        links: [
          { label: dict.footer.van, href: withLocale(locale, "/le-van") },
          { label: dict.nav.impact, href: withLocale(locale, "/impact") },
          { label: dict.nav.voyage, href: withLocale(locale, "/voyage") },
          { label: dict.nav.support, href: withLocale(locale, "/soutenir") },
        ],
      },
      {
        title: dict.footer.project,
        links: [
          { label: dict.nav.about, href: withLocale(locale, "/a-propos") },
          { label: dict.nav.faq, href: withLocale(locale, "/faq") },
          { label: dict.nav.contact, href: withLocale(locale, "/contact") },
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
      platform: platform as "instagram" | "facebook" | "linkedin" | "youtube",
      url,
    })),
    legal: {
      copyright: `© ${year} ${SITE_NAME}. ${dict.footer.rights}`,
      links: [
        { label: dict.breadcrumb.legal, href: withLocale(locale, "/mentions-legales") },
        { label: dict.breadcrumb.privacy, href: withLocale(locale, "/confidentialite") },
      ],
    },
    attribution: {
      text: dict.footer.produced_by,
      href: THE_CORNER.factoriesUrl,
      logo: THE_CORNER.logoUrl,
    },
    manageCookiesEvent: "soleva:open-cookie-settings",
  }
}
