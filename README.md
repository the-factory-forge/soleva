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
