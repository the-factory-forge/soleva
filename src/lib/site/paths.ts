// Static site paths (localized under /<locale>) shared by sitemap, llms.txt
// and machine-readable endpoints.

export const STATIC_PATHS = [
  "",
  "/a-propos",
  "/le-van",
  "/habitat",
  "/impact",
  "/voyage",
  "/soutenir",
  "/contact",
  "/faq",
  "/equipe",
  "/partenaires",
  "/presse",
  "/blog",
  "/evenements",
  "/sponsoring",
  "/crowdfunding",
  "/mentions-legales",
  "/confidentialite",
  "/plan-du-site",
] as const;

export const PAGE_META_KEYS: Record<string, string> = {
  "": "home",
  "/a-propos": "about",
  "/le-van": "van",
  "/soutenir": "support",
  "/mentions-legales": "legal",
  "/confidentialite": "privacy",
};
