import type { Locale } from "@/lib/i18n/config";

export type NavItem = {
  key: string;
  href: string;
  children?: NavItem[];
};

// Paths are locale-agnostic; the locale prefix is added at render time.
// IA restructuree (feat/content-implementation): groupes <= 6 top-level items.
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
  {
    key: "projet",
    href: "/a-propos",
    children: [
      { key: "about", href: "/a-propos" },
      { key: "equipe", href: "/equipe" },
      { key: "partenaires", href: "/partenaires" },
    ],
  },
  { key: "voyage", href: "/voyage" },
  {
    key: "actualites",
    href: "/blog",
    children: [
      { key: "blog", href: "/blog" },
      { key: "presse", href: "/presse" },
      { key: "evenements", href: "/evenements" },
    ],
  },
  {
    key: "support",
    href: "/soutenir",
    children: [
      { key: "sponsoring", href: "/sponsoring" },
      { key: "crowdfunding", href: "/crowdfunding" },
    ],
  },
  { key: "faq", href: "/faq" },
];

export const vanPillars = [
  { key: "solar", href: "/le-van/energie-solaire" },
  { key: "electric", href: "/le-van/motorisation-electrique" },
  { key: "habitat", href: "/le-van/habitat-autonome" },
];

export function withLocale(locale: Locale, href: string): string {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}
