import { locales, ogLocales, type Locale } from "@/lib/i18n/config";

/**
 * Framework-agnostic metadata shape (structurally compatible with
 * Next.js `Metadata`). Sites adapt it to their framework:
 *   - Next.js  : `return buildMetadata(...) as Metadata`
 *   - TanStack : feed the fields into the route `head` meta tags
 */
export interface SiteMetadata {
  title?: string;
  description?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  robots?: { index: boolean; follow: boolean } | string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
    images?: { url: string; width?: number; height?: number; alt?: string }[];
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
}

interface BuildMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  siteUrl: string;
  siteName: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
  siteUrl,
  siteName,
  ogImage,
  noIndex = false,
}: BuildMetadataOptions): SiteMetadata {
  const cleanPath = path === "/" ? "" : path;
  const canonical = `${siteUrl}/${locale}${cleanPath}`;

  // Default share image is the hero/video frame (public/images/og-image.webp).
  // Any route-provided ogImage must be absolute for crawlers (habitat passes
  // a relative /images/... URL - normalize it here).
  const ogImageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${siteUrl}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`
    : `${siteUrl}/images/og-image.webp`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${siteUrl}/${l}${cleanPath}`;
  }
  languages["x-default"] = `${siteUrl}/${locales[0]}${cleanPath}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: ogLocales[locale],
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
