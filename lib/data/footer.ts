import { type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n"
import { withLocale } from "@/lib/navigation"
import { CONTACT, SOCIALS, SITE_NAME } from "@/lib/constants"
import { getFooterProps as getFooterPropsHelper } from "@/lib/footer-helpers"
import { services } from "@/lib/data/services"

export function getFooterProps(locale: Locale, dict: Dictionary) {
  return getFooterPropsHelper({
    siteName: SITE_NAME,
    description: dict.footer.description,
    logo: "/images/soleva-logo.webp",
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
      platform: platform as "instagram" | "facebook" | "linkedin" | "youtube" | "x" | "tiktok" | "whatsapp",
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
      href: "https://the-corner.io/",
      logo: "https://assets.the-corner.io/logos/the_corner-icon.png",
    },
    manageCookiesEvent: "soleva:open-cookie-settings",
    variant: "dark",
  })
}
