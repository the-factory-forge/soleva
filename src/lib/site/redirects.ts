import { defaultLocale, isLocale } from "../i18n/config";
import { STATIC_PATHS } from "./paths";

// Public URLs from the Angular sitemap. Keep incoming bookmarks and backlinks.
export const LEGACY_PATHS: Record<string, string> = {
  "/about-soleva": "/a-propos",
  "/agb": "/confidentialite",
  "/contact-us": "/contact",
  "/electric-conversion-van": "/le-van/conversion-electrique",
  "/environmental-impact": "/impact",
  "/events": "/evenements",
  "/journey": "/voyage",
  "/news": "/presse",
  "/partners": "/partenaires",
  "/solar-van": "/le-van/systeme-solaire",
  "/team": "/equipe",
  "/sitemap": "/plan-du-site",
  "/search": "/plan-du-site",
  "/auth": "/login",
};

export function legacyRedirect(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const firstSegment = path.split("/")[1];
  const localized = isLocale(firstSegment);
  const locale = localized ? firstSegment : defaultLocale;
  const page = localized ? path.slice(firstSegment.length + 1) : path;
  const target = Object.hasOwn(LEGACY_PATHS, page) ? LEGACY_PATHS[page] : undefined;

  if (target) return `/${locale}${target}`;
  if (!localized && page !== "/" && STATIC_PATHS.some((p) => p === page)) {
    return `/${locale}${page}`;
  }
  return undefined;
}
