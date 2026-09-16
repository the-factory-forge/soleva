# Soleva

> **Production status** : **validated 28.08.2026** (visual parity, video hero autoplay, lightbox galleries, i18n fr/en/de/it, responsive). **Merged to `main` (`7f2c3c4`, pushed)**. Lighthouse mobile: **73 Performance / 96 Accessibility / 100 Best Practices / 100 SEO / 3-3 Agentic Browsing** (video LCP accepted by decision). Remaining: redeploy the current build to `soleva.the-corner.io` (prod was a 2-week-old build, 43→~73 expected), verify Range support on the prod server (Safari/Firefox video), client data (email/IDE).

Website of **Soleva** - ASSOCIATION SOLEVA (Renens VD, Suisse). Soleva transforms an
old van into a solar-powered electric camper: a Swiss demonstrator of sustainable
mobility, retrofit and solar energy.

Built from [The Corner Factory](https://github.com/the-factory-forge/forge-template)
site template (TanStack Start). Migrated from the v0 Next site (process validation,
Phase 3.16 of the factory roadmap).

## Stack

- TanStack Start (Vite+ / Nitro / React Compiler)
- Tailwind CSS v4 + registry components from
  [forge-registry](https://github.com/the-factory-forge/forge-registry)
- Custom i18n dicts (fr/en/de/it) in `src/lib/i18n/`
- GEO layer: JSON-LD, dynamic robots.txt/sitemap, llms.txt, `/api/data.json`
- Auth/DB optional (Better Auth + Drizzle/Postgres) - off by default (showcase mode)

## Dev

```sh
vp install        # also generates Varlock environment types
vpr dev           # http://localhost:3000
vpr lint          # lint + type-check
vpr test          # unit tests
vpr test:e2e      # production build + browser checks on port 3100
vpr build && vpr start
```

Environment variables are declared in `.env.schema` and read through `ENV` from
`varlock/env`. Validate local setup with `vp exec varlock load --agent`.
Auth stays disabled until both `DATABASE_URL` and `BETTER_AUTH_SECRET` are set.
Keep public `VITE_*` values consistent at build and runtime; `vpr start` and the
Docker entrypoint load server settings through Varlock at startup.

The latest template reconciliation, preserved adaptations, and validation results
are recorded in [docs/template-sync.md](docs/template-sync.md).

## Registry components

Install individual Forge components with `vpr ui add @forge/<name>`.
The `@forge` namespace in `components.json` uses the current `public/r` registry;
the retired aggregate `registry:pull` script has been removed.

Cookie banner and newsletter were installed from registry revision
`8846c1ad6ee36b6c5dfaf613ac59184491c8745b` on 2026-09-16. Shared components live
under `src/components/forge/`, with Soleva's translations and analytics wiring
in `src/components/layout/`. They reuse the site's existing `cn` utility.
When updating the cookie component, preserve its `onConsentChange` callback,
restoration of saved preferences, and handling of disabled consent categories.

The reusable `NewsletterButton` opens a lazy-loaded dialog from the navbar,
immediately before the language picker. Its form is deliberately disabled and
labelled as coming soon in all four languages. It does not collect, store, or send email addresses. Enable
it only after a real subscription destination is connected; the registry demo
with simulated success is not used.

## Site content

- `src/lib/site/constants.ts` - identity, contact, socials
- `src/lib/site/services.ts` - the 3 pillars (conversion, solar, habitat)
- `src/lib/site/pricing.ts` - sponsor tiers
- `src/lib/i18n/{fr,en,de,it}.json` - all copy

## Deploy

dockploy (VPS): compose app-only pattern, one database `factory_soleva` if login
is ever enabled. See the forge-template README "Deployment" for details.

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
