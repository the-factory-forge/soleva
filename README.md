# Soleva

Website of **Soleva** - ASSOCIATION SOLEVA (Renens VD, Suisse). Soleva transforms an
old van into a solar-powered electric camper: a Swiss demonstrator of sustainable
mobility, retrofit and solar energy.

Built from [The Corner Factory](https://github.com/the-corner-inc/factory-template)
site template (TanStack Start). Migrated from the v0 Next site (process validation,
Phase 3.16 of the factory roadmap).

## Stack

- TanStack Start (Vite+ / Nitro / React Compiler)
- Tailwind CSS v4 + registry components from
  [react-factories](https://github.com/the-corner-inc/react-factories)
- Custom i18n dicts (fr/en/de/it) in `src/lib/i18n/`
- GEO layer: JSON-LD, dynamic robots.txt/sitemap, llms.txt, `/api/data.json`
- Auth/DB optional (Better Auth + Drizzle/Postgres) - off by default (showcase mode)

## Dev

```sh
pnpm install
pnpm dev          # http://localhost:3000
vpr check         # lint + type-check
vpr build && pnpm start
```

## Site content

- `src/lib/site/constants.ts` - identity, contact, socials
- `src/lib/site/services.ts` - the 3 pillars (conversion, solar, habitat)
- `src/lib/site/pricing.ts` - sponsor tiers
- `src/lib/i18n/{fr,en,de,it}.json` - all copy

## Deploy

dockploy (VPS): compose app-only pattern, one database `factory_soleva` if login
is ever enabled. See the factory-template README "Deployment" for details.

## SEO mechanics

Status of the SEO/perf adaptation (branch `seo-adaptation`).

| #   | Item                                                       | Status | Where                                                                                                                                                   |
| --- | ---------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Runtime compression (br/gzip, skips <1KB)                  | ✅     | `server/plugins/compression.ts`                                                                                                                         |
| 2   | Cache `public, max-age=604800` on `/images/**`             | ✅     | `vite.config.ts` `routeRules`                                                                                                                           |
| 3   | Docker build skips root `prepare` (pnpm 11 verify-deps)    | ✅     | `Dockerfile` `pnpm_config_ignore_scripts=true`                                                                                                          |
| 4   | Font preload (montserrat latin 400 woff2)                  | ✅     | `src/routes/__root.tsx`                                                                                                                                 |
| 5   | `content-visibility:auto` on below-fold sections           | ✅     | 37 sections, heroes excluded                                                                                                                            |
| 6   | Lazy images (default `loading=lazy`)                       | ✅     | `src/components/ui/image.tsx` shim                                                                                                                      |
| 7   | Reveal SSR-visible (no hidden-on-SSR content)              | ✅     | `src/components/ui/reveal.tsx` `initial={hydrated ? ... : false}`                                                                                       |
| 8   | Navbar SSR links                                           | ✅     | `src/components/navigation/navbar.tsx`                                                                                                                  |
| 9   | og:image                                                   | ❌     | `/images/hero.webp` exists but no route sets a default og:image (only `/habitat` passes one)                                                            |
| 10  | llms.txt markdown links                                    | ✅     | `src/routes/llms[.]txt.ts`                                                                                                                              |
| 11  | srcset variants (480 q90 / 800 q80 + native top candidate) | ✅     | `src/lib/constants.ts` `srcSetFor`, `scripts/generate-image-variants.mjs`                                                                               |
| 12  | Hero lazy (video `preload="none"` + ~1s frame poster)      | ✅     | `src/components/home/home-hero.tsx`, `public/images/video-poster.webp`                                                                                  |
| 13  | Logo sizing (651px → 300px q80, backup kept)               | ✅     | `public/images/soleva-logo.webp` (+`-651x267.webp` backup)                                                                                              |
| 14  | Single JSON-LD                                             | ❌     | Multiple `application/ld+json` blocks (WebSite + Organization + FAQ/Breadcrumb); WebSite `@id` → `#organization` is not linked by the Organization node |
