import { expect, test } from "vite-plus/test";

import { legacyRedirect } from "./redirects";

test("Angular backlinks reach their matching React pages and retain the locale", () => {
  const paths = [
    ["about-soleva", "a-propos"],
    ["agb", "confidentialite"],
    ["contact-us", "contact"],
    ["electric-conversion-van", "le-van/conversion-electrique"],
    ["environmental-impact", "impact"],
    ["events", "evenements"],
    ["journey", "voyage"],
    ["news", "presse"],
    ["partners", "partenaires"],
    ["solar-van", "le-van/systeme-solaire"],
    ["team", "equipe"],
    ["sitemap", "plan-du-site"],
    ["search", "plan-du-site"],
  ];
  for (const [oldPath, newPath] of paths) {
    expect(legacyRedirect(`/${oldPath}`)).toBe(`/fr/${newPath}`);
    for (const locale of ["fr", "en", "de", "it"]) {
      expect(legacyRedirect(`/${locale}/${oldPath}/`)).toBe(`/${locale}/${newPath}`);
    }
  }
  expect(legacyRedirect("/habitat")).toBe("/fr/habitat");
  expect(legacyRedirect("/crowdfunding")).toBe("/fr/crowdfunding");
});

test("current pages do not loop and unknown pages remain 404 candidates", () => {
  for (const path of [
    "/",
    "/fr",
    "/fr/habitat",
    "/en/le-van/systeme-solaire",
    "/fr/missing",
    "/missing",
    "/es/team",
    "/fr/team/extra",
    "/api/auth/session",
    "/constructor",
    "/__proto__",
    "//example.com/team",
  ]) {
    expect(legacyRedirect(path)).toBeUndefined();
  }
});
