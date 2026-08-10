import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * Workaround: in this TanStack Router version, params are not parsed for
 * routes whose param is the first URL segment (e.g. /$lang). Loaders must
 * derive the locale from location.pathname instead of params.
 */
export function localeFromPathname(pathname: string, fallback: Locale = defaultLocale): Locale {
  const match = pathname.match(/^\/([^/]+)/);
  return match && isLocale(match[1]) ? (match[1] as Locale) : fallback;
}
