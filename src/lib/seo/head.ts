// Converts the framework-agnostic SiteMetadata (registry build-metadata)
// into TanStack Router head() meta/links/scripts declarations.

import type { SiteMetadata } from "@/lib/seo/build-metadata";

export interface HeadDeclaration {
  meta: Record<string, string>[];
  links: { rel: string; href: string; hrefLang?: string; sizes?: string; type?: string }[];
}

export function metadataToHead(meta: SiteMetadata): HeadDeclaration {
  const head: HeadDeclaration = { meta: [], links: [] };

  if (meta.title) head.meta.push({ title: meta.title });
  if (meta.description) head.meta.push({ name: "description", content: meta.description });

  if (meta.alternates?.canonical) {
    head.links.push({ rel: "canonical", href: meta.alternates.canonical });
  }
  if (meta.alternates?.languages) {
    for (const [lang, href] of Object.entries(meta.alternates.languages)) {
      head.links.push({ rel: "alternate", hrefLang: lang, href });
    }
  }

  if (meta.robots) {
    const content =
      typeof meta.robots === "string"
        ? meta.robots
        : [
            meta.robots.index === false && "noindex",
            meta.robots.index !== false && "index",
            meta.robots.follow === false && "nofollow",
            meta.robots.follow !== false && "follow",
          ]
            .filter(Boolean)
            .join(", ");
    head.meta.push({ name: "robots", content });
  }

  const og = meta.openGraph;
  if (og) {
    if (og.title) head.meta.push({ property: "og:title", content: og.title });
    if (og.description) head.meta.push({ property: "og:description", content: og.description });
    if (og.url) head.meta.push({ property: "og:url", content: og.url });
    if (og.siteName) head.meta.push({ property: "og:site_name", content: og.siteName });
    if (og.locale) head.meta.push({ property: "og:locale", content: og.locale });
    if (og.type) head.meta.push({ property: "og:type", content: og.type });
    if (og.images?.[0]) {
      const img = og.images[0];
      head.meta.push({ property: "og:image", content: img.url });
      if (img.width) head.meta.push({ property: "og:image:width", content: String(img.width) });
      if (img.height) head.meta.push({ property: "og:image:height", content: String(img.height) });
    }
  }

  const tw = meta.twitter;
  if (tw) {
    if (tw.card) head.meta.push({ name: "twitter:card", content: tw.card });
    if (tw.title) head.meta.push({ name: "twitter:title", content: tw.title });
    if (tw.description) head.meta.push({ name: "twitter:description", content: tw.description });
    if (tw.images?.[0]) head.meta.push({ name: "twitter:image", content: tw.images[0] });
  }

  return head;
}
