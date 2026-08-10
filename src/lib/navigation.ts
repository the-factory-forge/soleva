import type { Locale } from "@/lib/i18n/config"

export type NavItem = {
  key: string
  href: string
  children?: NavItem[]
}

// Paths are locale-agnostic; the locale prefix is added at render time.
export const mainNav: NavItem[] = [
  { key: "home", href: "/" },
  {
    key: "van",
    href: "/le-van",
    children: [
      { key: "conversion", href: "/le-van/conversion-electrique" },
      { key: "solaire", href: "/le-van/systeme-solaire" },
      { key: "habitat", href: "/habitat" },
      { key: "impact", href: "/impact" },
    ],
  },
  { key: "about", href: "/a-propos" },
  { key: "voyage", href: "/voyage" },
  { key: "support", href: "/soutenir" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
]

export const vanPillars = [
  { key: "solar", href: "/le-van/energie-solaire" },
  { key: "electric", href: "/le-van/motorisation-electrique" },
  { key: "habitat", href: "/le-van/habitat-autonome" },
]

export function withLocale(locale: Locale, href: string): string {
  if (href === "/") return `/${locale}`
  return `/${locale}${href}`
}
