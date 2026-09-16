# Soleva migration audit — 16 September 2026

Compared the current [soleva.org sitemap](https://soleva.org/sitemap.xml), a fresh export of 29 French/English editorial pages, source diagrams and interactive source pages against this React/TanStack project. This is a local migration audit; changes have not been deployed.

This report supersedes the September 2 findings where they conflict. In particular, several supposedly unsupported technical figures **are present in source images**, which the earlier text-only audit missed. German and Italian are project translations; the original only supplies French and English, sometimes with English fallback content.

## Page coverage and redirects

All source editorial topics now have a destination. Matching paths remain available in all four languages. Renamed paths permanently redirect (HTTP 301), preserving language and query strings. Unlocalized legacy URLs use French.

| Original path                                       | React destination                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------- |
| `/`                                                 | `/fr` (or the selected language)                                  |
| `/about-soleva`                                     | `/a-propos`                                                       |
| `/electric-conversion-van`                          | `/le-van/conversion-electrique`                                   |
| `/solar-van`                                        | `/le-van/systeme-solaire`                                         |
| `/environmental-impact`                             | `/impact`                                                         |
| `/journey`                                          | `/voyage`                                                         |
| `/team`                                             | `/equipe`                                                         |
| `/news`                                             | `/presse`                                                         |
| `/partners`                                         | `/partenaires`                                                    |
| `/events`                                           | `/evenements`                                                     |
| `/contact-us`                                       | `/contact`                                                        |
| `/agb` (privacy policy)                             | `/confidentialite`                                                |
| `/habitat`, `/blog`, `/sponsoring`, `/crowdfunding` | Same localized paths                                              |
| `/search`, `/sitemap`                               | `/plan-du-site`, a searchable page directory                      |
| `/auth`                                             | `/login`, using the existing new authentication screen            |
| `/under-maintenance`                                | Intentionally not recreated as a public content page; returns 404 |

Unknown routes and unknown van slugs return genuine 404 responses. Loader-dependent metadata no longer throws during those errors.

## Restored information and assets

- **Conversion:** published specifications, four charging paths, original five conversion stages, vehicle history (1987 Peugeot J9 and 190 kg original engine), before/after illustration, and eleven construction photographs.
- **Solar:** deployable roof diagrams, lightweight/bifacial construction, motorized tilt, CSEM/Solar Impulse background and V2X. Diagram captions make image-only information available as text in all four languages.
- **Impact:** original comparison chart and **81%** reduction, including battery/motor embodied energy and the assumption of solar charging.
- **Journey:** historical dates **15 June–3 August 2024**, original programme and stops map, awareness activities, and the correct [Polarsteps tour](https://www.polarsteps.com/SolevaSolarVan/11946872-the-swiss-tour). Removed unsupported town counts and the invented map itinerary.
- **Association:** education mission, student projects and the original historical project-summary graphic.
- **Blog/events:** fuller documentary-premiere and Vanlife Expo information, stable article anchors and a link from the event to its full programme.
- **Sponsors:** fifteen missing logos, original package comparison and [sponsorship brochure](https://drive.google.com/file/d/1ZSKZJLHM0KCXjtGPnQJSe1QDb3Pf9n1V/view). Replaced invented prices/post counts with the published Silver/Gold/Platinum benefits.
- **Press/identity:** RSI logo, Soleva favicon/touch icon, company LinkedIn and shared press records on the About page; no fabricated date for 24Heures.
- **Privacy:** restored the named responsible person, access-log information, published seven-day security-log retention and social-network information. Removed the unsupported statement that Google Analytics has a default 14-month retention period. The hosting configuration itself was not inspected.

The [media manifest](migration-media-sources.json) records the original source URLs for 39 recovered assets.

### Corrected figures

| Subject          | Migrated value                      | Source-backed correction                                                                            |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Battery          | 55 kWh                              | 58 kWh, 400 V, eight Volkswagen batteries                                                           |
| Solar array      | 1,350 W                             | Approximately 5 kW; 24 m² deployed                                                                  |
| Carbon reduction | 80%                                 | 81%, with the original comparison's assumptions                                                     |
| Range            | Unqualified estimate                | Source overview: 250 km; separate schematic: >300 km at 80 km/h                                     |
| Solar charging   | Unqualified 150 km/day              | 150 km parked/deployed/tilted; 30 km folded while driving, based on annual average Swiss irradiance |
| Crowdfunding     | CHF 29,583 / 147% / CHF 20,000 goal | Nearly CHF 30,000, more than 130 backers, one month in summer 2022                                  |

The restored information describes the **first prototype**; it is not a specification promise for the replacement van. Removed unsupported road-certification claims.

## Broken navigation and technical fixes

- Fixed the invisible language-switcher and mobile-menu triggers. The original conditional children never suspended, so their fallback buttons never appeared.
- Replaced the template’s unsubscribed pathname helper with TanStack location state, so navigation highlighting and language destinations update after client navigation.
- Fixed related-page links with duplicated locale prefixes (`/fr/fr/...`), affecting twelve URLs across four languages.
- Repaired the support-page share-button props and the existing dashboard's outdated navbar API/typed navigation.
- Aligned the direct TanStack Router dependency with the version already required by TanStack Start, eliminating incompatible duplicated router types.
- Corrected the JSON-LD telephone number and shared organization identifier; used the configured base URL consistently.
- Replaced hardcoded, stale font-preload filenames with bundler-generated URLs.
- Expanded machine-readable page/article data, included the directory in discovery endpoints, allowed crawlers to access public `/api/data.json`, and removed fabricated sitemap modification timestamps.
- Isolated unit tests from application-only Vite plugins and development warmup.

## External links and deliberate differences

49 unique rendered external links were requested: **36 responded successfully** and **13 remain unverified** (eleven LinkedIn personal profiles returned HTTP 999; 24Heures failed the automated connection; Swiss Graphic Services timed out). An automated access block is not evidence that a URL is dead.

- The old Energy Lab domain has a certificate/host problem. The partner now links to the matching [Swiss Energy Lab profile](https://www.linkedin.com/showcase/swiss-energy-lab/), which responded successfully.
- Rouge FM's old episode and Justin Burks/Birdhouse's old site return 404. Their source credits remain visible without active broken links.
- LFM's second interview URL also returns 404. The working first interview remains linked; no replacement second-part URL was found.
- Newsletter signup and a contact form were explicitly excluded by the recorded migration decisions in [content-recovery-plan.md](content-recovery-plan.md#4-décisions--périmètre-validées-avec-le-client). That decision is preserved; contact uses the published email address.
- Preserved the original roles of the two addresses: **Avenue de Cour 19, 1007 Lausanne** for public contact/privacy, **Rue de Lausanne 64, 1020 Renens** for donations. The original privacy page's inconsistent postcode was aligned with its footer. A single replacement address cannot be established from the original site alone.
- No biographies were invented for the two people whose source biographies are empty. The association UID also remains unset; the internal request to supply it is no longer displayed to visitors.

## Validation

The production crawl passed **84 pages, 3,620 internal link occurrences, 89 internal destinations, 115 local assets and 70 legacy redirects**, with zero reported failures.

- Production build and full-project type-aware lint pass; non-blocking existing lint/deprecation warnings remain.
- Formatting/lint/type checks pass on the changed files.
- Two redirect regression tests pass, covering legacy language mappings, loops and unknown/prototype-property paths.
- The repeatable `vpr audit:migration` crawl checks every sitemap page, internal link, anchor, local image/font/stylesheet, canonical, language alternate, title, description, JSON-LD parseability, redirect, selected 404 and discovery endpoint.
- Browser checks covered directory filtering, language switching with the current path retained, mobile-menu navigation at 390 px, image viewing/Escape dismissal, missing images and horizontal overflow.

Run locally with the project server on **port 3100**:

```sh
PORT=3100 vpr dev --port 3100 --strictPort
vpr audit:migration http://localhost:3100
vp test --run
vpr lint
```

This does not verify production hosting rules, email delivery, logged-in account flows or the thirteen external destinations that blocked automated checks. The source privacy retention policy should be matched by the deployed host's log configuration.
