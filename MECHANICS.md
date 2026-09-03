# MECHANICS — factory-forge/soleva

> **Repo** : factory-forge/soleva (client site) · **Branch** : main (fix/validation-learnings merged 28.08.2026, `7f2c3c4`, pushed) · **Locales** : fr/en/de/it · **Analytics** : Strict scripts mechanics ready, IDs empty (inactive).
> Parity batch applied 27.08.2026 (accordion keyframes, reveal, immutable cache, latin fonts + preloads, real og:image, Analytics Strict scripts, JSON-LD E.164, footer attribution forge).
> Validation + perf session 28.08.2026 (hero video 62MB re-encoded to 720p/480p autoplay + poster frame-0, lightbox portal, crash fix (React icons never in loaderData - Seroval), i18n a-propos/voyage/soutenir x4, dict back in stream (L1 reverted - double hydration cost TTI), lang/mobile menus load on first open, fonts preloads 400/800, llms forge credit, JSON-LD geo+E.164, stable keys, dead components removed). **Lighthouse mobile: 73 Perf / 96 A11y / 100 BP / 100 SEO / 3-3 Agentic** (video LCP accepted by decision - hero autoplay).

> **Legend** : ✅ present · ⚠️ partial · ⏳ pending · ➖ absent · N/A not applicable (by decision)
> **Last update** : 28.08.2026

## 1. Changelog (Next.js → today)

- **Migration**: ported from forge-template (fr/en/de/it), solar association (NGO schema).
- **Parity batch (27.08)**: accordion keyframes, reveal fix, /assets immutable cache, latin fonts (montserrat) + preloads 600/700, **og-image 1200x630 from the hero video poster frame (video-poster.webp)**, absolute og URLs everywhere, Analytics Strict scripts (+ VITE_ADS_CONVERSION_LABEL exposed in env/client), attribution forge, localized alts (timeline, QR, 404 logo), localized breadcrumb aria-label, docker-compose labels args.
- **Validation learnings batch (27.08)**: stable keys in animated lists (Reveal), CSS-only hero entrance (tc-fade-up 0.01 + tc-img-reveal, prefers-reduced-motion) on home video hero + habitat hero (was motion SSR opacity:0), animations-lazy module (below-fold motion chunk), preloads corrected to faces used above the fold (400/500/600/800 - LCP h1 is extrabold 800), cookie banner font-semibold -> font-medium.
- **Analytics**: Strict scripts - IDs empty.

## 2. Mechanics matrix

| Category | Mechanic | Description | Where | Status | Comments |
|---|---|---|---|---|---|
| Rendering | SSR page rendering | Server-rendered HTML via TanStack Start + Nitro node-server | vite.config.ts (nitro) + src/start.ts | ✅ |  |
| Rendering | Client hydration & SPA navigation | Hydrated client-side routing | src/router.tsx | ✅ |  |
| Rendering | SSR query integration | Loader prefetch -> TanStack Query cache (SSR/client dedupe) | src/router.tsx | ✅ |  |
| Rendering | React Compiler auto-memoization | babel reactCompilerPreset | vite.config.ts | ✅ |  |
| Rendering | Dynamic html lang per locale | lang derived from pathname | src/routes/__root.tsx | ✅ |  |
| Rendering | Streaming SSR | Progressive HTML streaming | vite.config.ts | ➖ | No explicit streaming config |
| Rendering | Static pre-rendering (SSG) | Pre-rendered pages | vite.config.ts | ➖ |  |
| Rendering | Error boundary / catch boundary | Graceful fallback UI on runtime errors | src/components/default-catch-boundary.tsx | ✅ |  |
| Rendering | Scroll restoration + intent preloading | scrollRestoration + defaultPreload intent | src/router.tsx | ✅ |  |
| Router | File-based routing + generated tree | routeTree.gen.ts from src/routes | src/routeTree.gen.ts | ✅ |  |
| Router | Pathless layout groups | _site / _auth / _guest | src/routes/*.tsx | ✅ |  |
| Router | Locale-first routes /$lang | All pages under locale param (params quirk workaround) | src/routes/_site/$lang.tsx | ✅ |  |
| Router | Root redirect to default locale | / -> /fr | src/routes/index.tsx | ✅ |  |
| Router | Invalid-locale fallback redirect | Unknown first segment -> /<locale>/rest | src/routes/_site/$lang.tsx | ✅ |  |
| Router | Real 404 (catch-all route) | notFound() throws -> 404 status, localized themed page | src/routes/_site/$lang/$.tsx | ✅ |  |
| Router | Server route handlers | robots / sitemap / llms / api data / auth | src/routes/*.ts | ✅ |  |
| Router | Route guards (auth-protected areas) | beforeLoad $isAuthEnabled / $getUser | src/routes/_auth/* | ✅ |  |
| Router | Request middleware (canonical host + CSRF) | 301 apex redirect + CSRF on server functions | src/start.ts + src/lib/site/middleware.ts | ✅ |  |
| i18n | Locales + default locale | fr/en/de/it (BBX: fr/en/de) | src/lib/i18n/config.ts | ✅ | 4 locales |
| i18n | Dictionary engine (JSON, lazy) | t()/tNode()/tList() dot-path helpers | src/lib/i18n/index.ts | ✅ |  |
| i18n | hreflang alternates + x-default | Per-page language alternates | src/lib/seo/build-metadata.ts | ✅ | inLanguage = site locales (4) - no hardcoding |
| i18n | og:locale mapping | fr_CH / en_US / de_CH / it_CH | src/lib/i18n/config.ts | ✅ |  |
| i18n | Language switcher (path-preserving) | Keeps current path, switches locale | src/components/navigation/language-switcher.tsx | ✅ |  |
| i18n | Localized legal pages | mentions / CGV / privacy per locale | src/routes/_site/$lang/legal/* | ✅ |  |
| i18n | Localized 404 copy | Static per-locale not-found copy | src/components/default-not-found.tsx | ✅ |  |
| i18n | Localized auth pages | login / signup / dashboard per locale | src/routes/_auth/$lang/* | ✅ |  |
| i18n | Translated slugs | Localized URL paths per locale (/en/about...) | src/lib/site/* | ➖ |  |
| i18n | Locale-aware number/date formatting (Intl) | Dates, numbers, currencies | src/lib/i18n | ➖ |  |
| SEO | Per-route meta (title/description) | Unique title + description per page per locale | src/lib/seo/build-metadata.ts | ✅ |  |
| SEO | Canonical URLs per locale | SITE_URL/<locale><path> | src/lib/seo/build-metadata.ts | ✅ |  |
| SEO | Open Graph tags + og:image | og:title/desc/url/image/locale | src/lib/seo/head.ts | ✅ |  |
| SEO | Twitter cards | summary_large_image | src/lib/seo/head.ts | ✅ |  |
| SEO | JSON-LD Organization / LocalBusiness | Root head, structured address + E.164 phone | src/routes/__root.tsx | ✅ |  |
| SEO | JSON-LD WebSite (@id linked) | WebSite <-> Organization graph | src/routes/__root.tsx | ✅ |  |
| SEO | JSON-LD BreadcrumbList | Interior pages navigation trails | src/components/seo/json-ld.tsx | ✅ | On interior pages |
| SEO | JSON-LD FAQPage | FAQ + service pages | src/components/seo/json-ld.tsx | ✅ |  |
| SEO | JSON-LD Service | Service detail pages | src/components/seo/json-ld.tsx | ✅ |  |
| SEO | Dynamic sitemap.xml | All routes x locales + hreflang + lastmod | src/routes/sitemap[.]xml.ts | ✅ |  |
| SEO | Dynamic robots.txt | Crawl directives + sitemap URL | src/routes/robots[.]txt.ts | ✅ |  |
| SEO | noindex support | robots meta flag (staging/legal) | src/lib/seo/build-metadata.ts | ➖ |  |
| SEO | Blog / articles | Content publishing | src/routes | ➖ |  |
| SEO | Internal search | Site search with results page | src/routes | ➖ |  |
| SEO | Image/video sitemap | Media entries in sitemap | src/routes/sitemap[.]xml.ts | ➖ |  |
| GEO | llms.txt (llmstxt.org) | Pages + services + languages + contact + credits | src/routes/llms[.]txt.ts | ✅ |  |
| GEO | llms-full.txt | Full-content dump for LLM grounding | src/routes | ➖ |  |
| GEO | Machine-readable endpoint | /api/data.json (JSON-LD ItemList + FAQPage) | src/routes/api/data[.]json.ts | ✅ |  |
| GEO | Agency credits (GEO) | The Corner Factory attribution in llms + footer | src/routes/llms[.]txt.ts + footer | ✅ |  |
| GEO | AI crawler policy | GPTBot/ClaudeBot/PerplexityBot rules | src/routes/robots[.]txt.ts | ➖ |  |
| Performance | HTTP compression (runtime) | gzip/brotli streaming middleware (zlib) | server/plugins/compression.ts | ✅ |  |
| Performance | Pre-compressed static assets | nitro compressPublicAssets (.gz/.br) | vite.config.ts | ✅ |  |
| Performance | Cache headers /images/** (7d) | Site photos | vite.config.ts routeRules | ✅ |  |
| Performance | Cache headers /assets/** (1y immutable) | Hashed bundles | vite.config.ts routeRules | ✅ |  |
| Performance | Font subsetting (latin-only) | @fontsource latin-* imports | src/styles.css | ✅ |  |
| Performance | Font preloads (woff2) | 400/800 preload links (body + LCP h1 extrabold; 500/600/700 load on demand) | src/routes/__root.tsx | ✅ |  |
| Performance | Responsive images (srcset) | 480/800/1200 webp variants, native-width candidate | scripts/generate-image-variants.mjs | ✅ |  |
| Performance | Quality convention (480 q90 / >480 q80) | Variant generator defaults | scripts/generate-image-variants.mjs | ✅ |  |
| Performance | Lazy images by default | loading=lazy unless priority (LCP) | src/components/ui/image.tsx | ✅ |  |
| Performance | Priority for LCP image | fetchPriority high on hero when LCP=image | src/components/ui/image.tsx | ✅ |  |
| Performance | content-visibility:auto | Below-fold sections | src/components/sections/* | ✅ |  |
| Performance | Scroll-reveal (SSR-visible, works) | useInView + post-hydration animate | src/components/ui/reveal.tsx | ✅ |  |
| Performance | Hydration-safe animations (SSR-visible) | initial hidden only after hydration - LCP visible without JS | src/components/ui/animations.tsx | ✅ |  |
| Performance | LCP-safe hero entrance (contentful at frame 1) | CSS keyframes with opacity 0.01 start - text is a contentful candidate at first paint | src/styles.css + home/habitat heroes | ✅ |  |
| Performance | Below-fold animation chunk lazy-loaded | motion chunk not modulepreloaded - loads dynamically after hydration | animations-lazy + sections/home-hero | ✅ |  |
| Performance | Hero video (autoplay, re-encoded) | 62MB -> 720p (13MB) + 480p (5.7MB) mp4, <source media> per viewport; poster = frame 0 (ffmpeg -ss 0.15); video painted above poster img (positioned) | src/components/home/home-hero.tsx | ✅ | LCP = video on autoplay (score trade-off accepted 28.08); SERVER MUST SUPPORT Range (200 full body = Safari/FF fail - verify at deploy) |
| Performance | Context-aware image sizes (sizes attr) | sizes per layout context - no 100vw over-download of originals | routes + ui/image | ✅ | Video hero exempt (poster is static, no srcset) |
| Performance | Route-level code splitting | Per-route + per-locale chunks | vite (rolldown) | ✅ |  |
| Performance | TanStack Query caching | staleTime 2min, SSR dedupe | src/router.tsx | ✅ |  |
| Performance | Image runtime optimizer / CDN | On-the-fly resizing | src/components/ui/image.tsx | ➖ |  |
| Performance | Bundle analysis / budgets | rollup visualizer, size budgets | vite.config.ts | ➖ |  |
| Performance | PWA (manifest + service worker) | Offline shell, installability | public/ | ➖ |  |
| Analytics | GA4 | Google Analytics 4, env-gated | src/lib/analytics.ts + env | ➖ | Strict scripts mechanics in place; GA/Ads IDs empty in .env.production (inactive until wired at deploy) |
| Analytics | Google Ads + conversions | tel/mailto click conversions | src/lib/analytics.ts (trackAdsConversion) | ➖ | Strict scripts mechanics in place; GA/Ads IDs empty in .env.production (inactive until wired at deploy) |
| Analytics | Per-action conversion labels | VITE_ADS_PHONE_LABEL / VITE_ADS_MAIL_LABEL | .env.production + Docker build args | ➖ | Strict scripts mechanics in place; GA/Ads IDs empty in .env.production (inactive until wired at deploy) |
| Analytics | Consent Mode v2 (default-deny) | 4 signals denied before any load | src/routes/__root.tsx | ✅ |  |
| Analytics | Strict scripts: tag loads only after consent | loadGtag() injected post-acceptance (nLPD) | src/lib/analytics.ts + cookie banner | ✅ |  |
| Analytics | GA4 link event tracking | click_phone / click_email events | src/components/layout/ga4-link-tracker.tsx | ➖ | Strict scripts mechanics in place; GA/Ads IDs empty in .env.production (inactive until wired at deploy) |
| Analytics | Privacy-friendly analytics (Plausible/Matomo) | Cookieless alternative | src/lib/analytics.ts | ➖ |  |
| Privacy | Cookie banner (granular) | necessary/analytics/marketing toggles + accept/reject | src/components/layouts/cookie-banner.tsx | ✅ |  |
| Privacy | No tracking before consent | Zero Google requests pre-acceptance | src/routes/__root.tsx + analytics.ts | ✅ |  |
| Privacy | Consent persistence + cross-tab sync | localStorage + storage events | src/components/layouts/cookie-banner.tsx | ✅ |  |
| Privacy | Manage-cookies re-open button | Reopens banner from footer | src/components/navigation/manage-cookies-button.tsx | ✅ |  |
| Privacy | Privacy policy page (nLPD/FADP) | Translated, cookie + tracking sections | src/routes/_site/$lang/legal/privacy.tsx | ✅ |  |
| Privacy | Cookie declaration table | Detailed cookie inventory | src/content/privacy-sections.ts | ➖ |  |
| Accessibility | Semantic landmarks | header/nav/main/footer | layouts + components | ✅ |  |
| Accessibility | ARIA patterns | aria-expanded/controls/labels on nav, menus, dialogs, accordion | components | ✅ |  |
| Accessibility | Focus-visible rings | Consistent focus styles | components/ui | ✅ |  |
| Accessibility | sr-only labels | Mobile menu, form labels | components | ✅ |  |
| Accessibility | Keyboard-accessible primitives | Base UI accordion/dropdown/sheet | src/components/ui/* | ✅ |  |
| Accessibility | a11y devtools + lint | @tanstack/devtools-a11y + oxlint jsx-a11y | vite.config.ts + __root.tsx | ✅ |  |
| Accessibility | Skip-to-content link | Keyboard first-tab link | src/routes/__root.tsx | ➖ |  |
| Accessibility | prefers-reduced-motion | Respect reduced motion | src/components/ui/reveal.tsx | ➖ |  |
| Accessibility | Contrast + touch targets (AA) | WCAG AA contrast, 44px targets | styles + components | ➖ |  |
| Legal | Mentions légales (imprint) | Company identity, IDE/UID, hosting, credits - translated | src/routes/_site/$lang/legal/mentions.tsx | ✅ |  |
| Legal | CGV / Terms | Commercial terms - translated | src/routes/_site/$lang/legal/cgv.tsx | ✅ |  |
| Legal | Privacy policy | nLPD/FADP disclosure - translated | src/routes/_site/$lang/legal/privacy.tsx | ✅ |  |
| Legal | Legal links in footer | Footer legal bar | src/lib/data/footer.ts | ✅ |  |
| Legal | Agency attribution (nofollow) | Produced by The Corner Factory | footer + mentions | ✅ |  |
| Security | CSRF protection | createCsrfMiddleware (server functions) | src/start.ts | ✅ |  |
| Security | Env validation (zod/t3-env) | Client + server schemas, empty-string tolerant | src/env/*.ts | ✅ |  |
| Security | Secrets management | No .env in git; placeholders; build args vs runtime env | .gitignore + Dockerfile + compose | ✅ |  |
| Security | Auth optional-by-default | null auth without DB -> protected routes redirect | src/lib/auth/auth.ts | ✅ |  |
| Security | External links rel | noopener noreferrer (+ nofollow on credits) | components | ✅ |  |
| Security | CSP (Content Security Policy) | No unsafe-inline in prod | vite.config.ts / headers | ➖ |  |
| Security | HSTS + security headers | Strict-Transport-Security, XFO, COOP, Referrer-Policy, X-Content-Type-Options | headers | ➖ |  |
| Security | Rate limiting / brute-force protection | Auth + form throttling | src/lib/auth | ➖ |  |
| Infra | Multi-stage Dockerfile | node:24-alpine, pnpm frozen lockfile, VITE_* build args | Dockerfile | ✅ |  |
| Infra | docker-compose.prod (dockploy) | App-only, env_file + build args, rolling update | docker-compose.prod.yml | ✅ |  |
| Infra | Auto-migrate on boot | drizzle-kit migrate when DATABASE_URL set | docker-entrypoint.sh | ✅ |  |
| Infra | Local Postgres compose | Dev database | docker-compose.yml | ✅ |  |
| Infra | Internal port 3000 (no host ports) | Multi-site VPS coexistence | Dockerfile EXPOSE | ✅ |  |
| Infra | CI/CD pipeline | GitHub Actions build/test/deploy | .github/workflows | ➖ |  |
| Infra | Docker HEALTHCHECK | Readiness probe | Dockerfile / compose | ➖ |  |
| Infra | Non-root container user | Least privilege in runtime | Dockerfile | ➖ |  |
| Infra | Rollback strategy | Fast revert to previous image | dockploy | ➖ |  |
| Infra | Structured logging | App + access logs | server/ | ➖ |  |
| Auth | Better Auth (email/password) | Sign in/up, sessions, cookie cache | src/lib/auth/auth.ts | ✅ |  |
| Auth | OAuth2 (GitHub + Google) | Env-gated social providers | src/lib/auth/auth.ts | ✅ |  |
| Auth | Localized auth routes | login / signup / dashboard | src/routes/_auth/$lang/* | ✅ |  |
| Auth | Protected dashboard (AppShell) | Sidebar shell for authenticated area | src/components/auth/app-shell.tsx | ✅ |  |
| Auth | Auth state via TanStack Query | Deduped queries + invalidation | src/lib/auth/queries.ts | ✅ |  |
| Auth | Drizzle schema + migrations | Auth tables, per-site DB isolation | src/lib/db + drizzle/ | ✅ |  |
| Auth | Roles / RBAC | Role-based access control | src/lib/auth | ➖ |  |
| Auth | User management | CRUD users, roles, invitations | src/lib/auth | ➖ |  |
| Auth | Admin dashboard / back-office | Site management UI | src/routes | ➖ |  |
| Auth | Blog / CMS | Editorial workflows, drafts, scheduling | src/routes | ➖ |  |
| Auth | Password reset / email verification / 2FA | Account security flows | src/lib/auth | ➖ |  |
| Content | Dictionary-driven content (JSON) | All copy in per-locale dicts | src/lib/i18n/*.json | ✅ |  |
| Content | FAQ (structured) | Categorized Q&A + FAQPage schema | src/routes/_site/$lang/faq.tsx | ✅ |  |
| Content | Services pages | Detail pages with CTAs | src/routes/_site/$lang/services/* | ✅ |  |
| Content | Home page sections | Hero, trust, services, testimonials, CTA | src/routes/_site/$lang/index.tsx | ✅ |  |
| Content | Contact page (tel/mailto + map) | Click-to-call/email, maps embed | src/routes/_site/$lang/contact.tsx | ✅ |  |
| Content | Contact form backend | Working form handler + notifications | src/routes/api | ➖ |  |
| Content | Newsletter (wired, backend) | Subscription capture + double opt-in | src/components/forms/newsletter.tsx | ➖ |  |
| Content | Testimonials | Social proof (dict-driven) | src/components/sections/testimonials.tsx | ✅ |  |
| Content | Blog / news / events | Time-based content | src/routes | ➖ |  |
| Content | CMS / headless integration | Content management | src/lib | ➖ |  |
| Tooling | Vite+ unified toolchain (vp) | dev/build/lint/fmt/check/test | package.json + vite.config.ts | ✅ |  |
| Tooling | Type-aware lint (oxlint) | react, react-perf, jsx-a11y, tanstack plugins | vite.config.ts | ✅ |  |
| Tooling | Staged git hooks (auto-fmt) | vp staged pre-commit | .vite-hooks | ✅ |  |
| Tooling | Registry workflow (pull) | forge-registry registry + clobber protection | scripts/pull-registry.mjs | ✅ |  |
| Tooling | Image variant generator | sharp-based srcset pipeline | scripts/generate-image-variants.mjs | ✅ |  |
| Tooling | Drizzle tooling | generate/migrate/push/studio | package.json | ✅ |  |
| Tooling | Docs (README/ROADMAP/AGENTS) | Extensive guidance | *.md | ✅ |  |
| Tooling | Unit tests | Vitest coverage | src/**/*.test.ts | ➖ |  |
| Tooling | E2E tests (Playwright) | Key flow coverage | e2e/ | ➖ |  |
| Tooling | Lighthouse CI | Perf/SEO/a11y gates | .github | ➖ |  |
| Monitoring | Error tracking (Sentry) | Client + server error capture | src/lib | ➖ |  |
| Monitoring | Uptime monitoring | Availability checks + alerts | infra | ➖ |  |
| Monitoring | RUM / Core Web Vitals tracking | Real-user metrics | src/lib | ➖ |  |
| Monitoring | Health endpoint | /health or /status | src/routes/api | ➖ |  |
| Monitoring | Analytics dashboards | GA4 + Ads live dashboards | external (GA4/Ads) | ➖ | Strict scripts mechanics in place; GA/Ads IDs empty in .env.production (inactive until wired at deploy) |

## 3. Gaps vs modern web standards

| # | Gap | Tag | Notes |
|---|---|---|---|
| 1 | Security headers: CSP, HSTS, X-Frame-Options, COOP, Referrer-Policy, X-Content-Type-Options | CORE |  |
| 2 | CI/CD pipeline (build/lint/deploy) | CORE |  |
| 3 | Docker HEALTHCHECK + health endpoint | CORE |  |
| 4 | Error tracking (Sentry) | CORE |  |
| 5 | Blog / news / articles | CORE |  |
| 6 | Contact form backend | CORE |  |
| 7 | Uptime monitoring | PRO |  |
| 8 | RUM / Core Web Vitals monitoring | PRO |  |
| 9 | Internal site search | PRO |  |
| 10 | Newsletter backend (double opt-in) | PRO |  |
| 11 | Translated slugs | PRO |  |
| 12 | PWA (manifest + service worker) | PRO |  |
| 13 | Image runtime optimizer / CDN | PRO |  |
| 14 | Bundle analysis / budgets | PRO |  |
| 15 | Lighthouse CI | PRO |  |
| 16 | Unit + E2E tests | PRO |  |
| 17 | Rate limiting / brute-force protection | PRO |  |
| 18 | Skip-to-content link | CORE |  |
| 19 | prefers-reduced-motion | PRO |  |
| 20 | Cookie declaration table | PRO |  |
| 21 | Privacy-friendly analytics (Plausible/Matomo) | PRO |  |
| 22 | AI crawler policy | OPTIONAL |  |
| 23 | llms-full.txt | OPTIONAL |  |
| 24 | Image/video sitemap | OPTIONAL |  |
| 25 | Streaming SSR / SSG | PRO |  |
| 26 | Intranet: RBAC, user mgmt, admin dashboard, CMS, audit logs | INTRANET |  |
| 27 | Password reset / email verification / 2FA | INTRANET |  |
| 28 | Rollback + structured logging | PRO |  |
