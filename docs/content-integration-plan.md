# Plan d'intégration UI/UX — nouvelles pages de contenu (audit + proposition)

> 📣 **Rapport d'état présentable au client : [`docs/client-migration-report.md`](client-migration-report.md)** — état d'avancement, décisions attendues (10 points), roadmap.

> ✅ **Audit + cross-audit (màj 2026-09-02, 4 volets : traductions · fidélité textes · SEO/GEO/routes/sitemap · UI/UX)** — verdict global : **0 P0 structurel** sur les 7 pages. Correctifs appliqués (commit `e7c1db5`) : date 24Heures inventée retirée (P0 contenu), `CopyIbanButton` + description IBAN localisés (P1), umlauts DE manquants (P1), avatars équipe 80 px alignés sur à-propos (P1), doublon top-level « Contact » retiré de la nav (P1 overflow lg), logo RSI→placeholder (P2). Restent en note : grille footer préexistante (6 cellules), chiffres non sourcés des **pages existantes** (29'583/147 %/20'000/250 km/55 kWh/1 350 W/150 km/80 % — hors périmètre des 7 pages, à traiter en phase « pages existantes » avec le client), noms d'événements raccourcis vs titres sources (déviation documentée, dates affichées à part), logos sponsors 15/22 à localiser, `api/data.json` à étendre (GEO), règles AI-crawlers robots.txt, umlauts DE préexistants (bloc auth), `vanPillars` mort.

> ⚙️ **Statut d'implémentation (màj 2026-09-02, branche `feat/content-implementation`)** : Phase 0 ✅ (nav restructurée en dropdowns, footer 4 colonnes, `STATIC_PATHS` +7, clés i18n meta/nav/breadcrumb ×4) · Phases 1-3 ✅ (`/presse`, `/evenements`, `/equipe`, `/partenaires`, `/blog`, `/sponsoring`, `/crowdfunding` — textes sources verbatim) · routeTree.gen.ts enregistré (édité manuellement, à régénérer via `vp dev`) · Reste : Phase 4 (enrichissements pages existantes + fidélité §10 du plan de récupération), QA toolchain (non exécutable dans le sandbox), médias (logos 15/22 à localiser), relecture client FR/DE/IT. Détail des commits : `git log --oneline feat/content-implementation`.

> Document compagnon de `docs/content-recovery-plan.md`. But : intégrer les nouvelles pages (équipe, presse, blog, événements, partenaires, sponsoring, crowdfunding) **proprement** dans le site actuel — architecture de l'information, navigation, registrations SEO, conventions de composants — en gardant l'existant intact et cohérent.
> Basé sur un audit réel du code (`src/`) : shell et templates de pages, composants réutilisables, conventions i18n, nav/footer, registrations SEO, sitemap, scripts. Aucun fichier n'a été modifié lors de l'audit.

---

## 1. Résumé exécutif

- **Ajouter 7 pages top-level « à plat » dans la nav casserait la barre** (elle a déjà 8 items et est contrainte en largeur). → **Restructurer la nav en 6 groupes** avec des dropdowns (mécanisme déjà existant, utilisé par « Le van »).
- **Réutiliser l'existant avant de créer** : cartes presse/équipe/partenaires/événements déjà codées (sur `/a-propos`, home, `/voyage`, `/soutenir`), `PRESS_LOGOS`/`TEAM_PHOTOS`/`MENTOR_PHOTOS`/`PARTNER_LOGOS` en base, `dict.home.press` présent mais inutilisé.
- **Éviter la duplication de contenu** : les nouvelles pages consomment les mêmes modules de données (`src/lib/data/*.ts`) que les sections existantes → une seule source de vérité.
- **Création de page = 1 fichier route + 1 bloc dict ×4 langues + 1 ligne dans `STATIC_PATHS` + entrée nav/footer** ; le reste (canonical, hreflang, sitemap, llms.txt, routeTree) est automatique.
- **Ordre de livraison** proposé en §8 (par risque décroissant, données déjà prêtes d'abord).

---

## 2. Architecture de l'information (proposition)

### 2.1 Problème
Top-level actuels : Accueil, Le van ▾ (3 enfants), À propos, Le voyage, Soutenir, FAQ, Contact (8 items, logo cliquable = home). Ajouter naïvement 7 items → 15 : barre saturée, hiérarchie illisible, mobile noyé.

### 2.2 Arborescence cible (recommandée)

```
Accueil (logo)
├─ Le van ▾            → Conversion électrique · Système solaire · Habitat · Impact environnemental   [Impact rejoint le groupe van, comme sur le site source]
├─ Le projet ▾         → À propos · L'équipe · Partenaires                                           [groupe « association »]
├─ Actualités ▾        → Le voyage · Blog · Presse & médias · Événements                             [Le voyage devient 1er enfant ; groupe « preuve/communauté »]
├─ Soutenir ▾          → Faire un don · Sponsoring · Crowdfunding                                    [« Faire un don » pointe /soutenir#donation]
├─ FAQ
└─ Contact (CTA bouton)
```

Justification :
- **≤ 6 items** au lieu de 8+7 → la barre respire, aucun débordement desktop.
- Calque le **regroupement du site source** (« Solar electric van » regroupe conversion/solaire/habitat/impact ; « Support Soleva » regroupe sponsoring/crowdfunding).
- **Impact sous « Le van »** : même famille sémantique que sur la source, et libère un slot.
- **Le voyage sous « Actualités »** : le tour est une actualité permanente (cohérent avec la source qui le met sous « About → Demonstration tour ») ; alternativement le garder top-level si le client y tient (option B, §2.4).
- « À propos » perd son statut top-level au profit du groupe « Le projet » — choix assumé pour contenir la barre ; il reste en 1er enfant du dropdown.

### 2.3 Correspondance route → label (nav, breadcrumb, dict)

| Route | Nav FR | Breadcrumb | meta |
|---|---|---|---|
| `/le-van` (existant) | Le van ▾ | Le van | meta.van |
| `/le-van/impact` → garder `/impact` (existant) | Impact | Impact | meta.impact |
| `/equipe` (nouveau) | L'équipe | L'équipe | meta.team |
| `/partenaires` (nouveau) | Partenaires | Partenaires | meta.partners |
| `/blog` (nouveau) | Blog | Blog | meta.blog |
| `/presse` (nouveau) | Presse & médias | Presse & médias | meta.press |
| `/evenements` (nouveau) | Événements | Événements | meta.events |
| `/sponsoring` (nouveau) | Sponsoring | Sponsoring | meta.sponsoring |
| `/crowdfunding` (nouveau) | Crowdfunding | Crowdfunding | meta.crowdfunding |
| `/soutenir` (existant) | Faire un don | Soutenir | meta.support |

> Alternative : garder les URLs en anglais (`/team`, `/news`, `/events`…) pour un SEO international cohérent avec l'EN ; le site est en `/fr` par défaut → **URLs françaises recommandées** (déjà le cas pour `/a-propos`, `/voyage`, `/soutenir`). Uniformiser.

### 2.4 Options écartées (documentées)
- **Option A — « enrichir plutôt que créer »** (pas de nouvelles pages pour presse/équipe/événements ; tout dans des sections existantes) : rejetée — le client compare à son site de 20 pages ; des pages dédiées = meilleur SEO par intention (crowdfunding, sponsoring, presse sont des recherches réelles) et des pages moins longues.
- **Option B — « Le voyage » top-level + « Actualités » sans lui** : acceptable si le client veut garder le voyage en vitrine ; la barre passe à 7 items (budget actuel). À trancher avec le client.
- **Pages `/sponsoring` + `/crowdfunding` séparées de `/soutenir`** : retenues (parité source, SEO), avec **`/soutenir` conservé comme hub don/bénévolat** et le bloc IBAN qui reste l'unique mécanique de don (`/soutenir#donation`). Pas de duplication : `/soutenir` garde les 3 formules de sponsoring ; `/sponsoring` affiche **les sponsors actifs** (logos + liens, nouveau contenu de la source) ; `/crowdfunding` raconte la campagne + vidéo + wemakeit.

---

## 3. Ce que dit l'audit du code (conventions à respecter impérativement)

### 3.1 Anatomie d'une page simple (template à copier — ex. `impact.tsx`, `faq.tsx`)
1. `createFileRoute("/_site/$lang/<page>")`
2. `loader` : `const locale = localeFromPathname(location.pathname); const dict = await getDictionary(locale); return { locale, dict };`
   → **Ne jamais lire `params.lang`** (bug connu de cette version TanStack : les params ne sont pas parsés sur les routes à paramètre initial — workaround commenté dans `_site/$lang.tsx` et `src/lib/i18n/pathname.ts`).
3. `head: ({ loaderData }) => metadataToHead(buildMetadata({ locale, title: `${dict.meta.<page>.title} | ${SITE_NAME}`, description: dict.meta.<page>.description, path: "/<page>", siteUrl: SITE_URL, siteName: SITE_NAME }))`
   → canonical + hreflang (4 langues + x-default) + OG + Twitter générés automatiquement.
4. `component` : `const { locale, dict } = Route.useLoaderData();`
5. Not found : si la page dépend d'un slug inconnu → `throw notFound()` (le layout a déjà `notFoundComponent`).

### 3.2 Composants à utiliser (app-first — **pas** les `sections/*` du registry, inutilisés par les routes)
| Rôle | Composant | Import |
|---|---|---|
| Héro + breadcrumb (JSON-LD BreadcrumbList auto) | `PageHero` | `@/components/layout/page-hero` |
| Breadcrumb seul (héros custom) | `Breadcrumb` | `@/components/layout/breadcrumb` |
| Bandeau CTA de fin | `CtaBand` | `@/components/ui/cta-band` |
| Titre de section | `SectionHeading` | `@/components/ui/section-heading` |
| Image (shim lazy/srcset) | `Image` | `@/components/ui/image` |
| Scroll reveal | `FadeUp` (alias `Reveal`) | `@/components/animations-lazy` |
| Liens CTA | `CtaLink`/`CtaExternal` | `@/components/ui/cta-button` |
| FAQ | `Accordion`/`FaqList` app | `@/components/faq/faq-list` ou `ui/accordion` |
| JSON-LD FAQ | `FaqJsonLd` | `@/components/seo/json-ld` |

### 3.3 Rythme visuel des sections (identité à respecter)
- Conteneur : `container-premium` (`mx-auto max-w-7xl px-5 sm:px-8 lg:px-12`) ; padding : `section-padding` (`py-20 md:py-28 lg:py-36`).
- Chaque section : `[contain-intrinsicsize:auto_800px] [content-visibility:auto]` (perf, pattern existant sur les 37 sections).
- Grids type : `grid gap-6 md:grid-cols-2`, `lg:grid-cols-3/4` ; logos `object-contain` dans des wrappers fixes (`h-10 w-20`, `h-16 w-28`) ; photos `object-cover` + ratios `aspect-[16/10]`, `aspect-video`…
- **Cartes réutilisables déjà en code** (copier le JSX existant, pas réinventer) :
  - Carte membre d'équipe + mentor : `/a-propos.tsx` (avatar rond `h-20 w-20 rounded-full`, rôle, mailto) ;
  - Carte presse : `/a-propos.tsx` (logo `h-10 w-20`, média, type, date·langue) ;
  - Carte événement : `/voyage.tsx` (titre + lieu `MapPin` + date) ;
  - Carte partenaire/logo : home `index.tsx` (`h-16 w-28`, nom) ;
  - Carte « article vedette » : `home-pillars.tsx` (image ratio 16/10, hover lift) — modèle des futures cartes blog ;
  - Carte tier sponsor : `/soutenir.tsx` (pill + prix + features).

### 3.4 i18n (dicts JSON imbriqués, par page)
- Ajouter **aux 4 fichiers** `src/lib/i18n/{fr,en,de,it}.json`, pour chaque nouvelle page :
  - `meta.<page>.title` + `meta.<page>.description`
  - `nav.<page>` + `breadcrumb.<page>`
  - bloc `<page> : { hero: { eyebrow, title, subtitle }, …sections }`
- Accès par `t(dict, "a.b.c")` (deepGet) ; clé absente → rend la clé brute (aucune erreur compile) → **toujours remplir les 4 langues**.
- Pour les contenus longs (bios, posts), préférer des **modules de données** `Record<Locale, T>` (`src/lib/data/*.ts`) plutôt que des dicts — pattern `services.ts`/`events.ts`.

### 3.5 Registrations SEO (les 3 surfaces — audit `sitemap[.]xml.ts`, `paths.ts`, `build-metadata.ts`)
1. `src/lib/site/paths.ts` → ajouter les chemins à `STATIC_PATHS` : alimente `sitemap.xml` (×4 langues + hreflang) **et** `llms.txt` automatiquement. `robots.txt` : rien à faire (statique).
2. `head()` de chaque route via `buildMetadata` (cf. §3.1) → title/desc/OG/canonical/hreflang.
3. Optionnel : `llms.txt` (nouvelle section `## Presse/Blog/…` si utile pour l'IA) et `api/data.json` (nouveau nœud `@graph` pour exposer les collections en JSON-LD). Pas requis pour le SEO classique.
4. Pas de page détail `$slug` au départ → **pas de boucle supplémentaire** dans `sitemap.xml` (si blog/événements passent en détail plus tard : ajouter une boucle type « services » dans `sitemap[.]xml.ts` et un `slug` aux modules de données).
5. `routeTree.gen.ts` : **auto-régénéré** par le plugin TanStack au `vp dev`/`vp build` — ne jamais l'éditer à la main.

### 3.6 Pièges connus (appliqués aux nouvelles pages)
- **Seroval/loaderData** : ne jamais mettre de composants React (icônes Lucide) dans un loader → crash. Résoudre icônes/contenu dans le composant (`getServiceBySlug`-style lookups), pas dans le loader.
- Locale et slugs : toujours dérivés du `pathname`, jamais des params.
- `loaderData!` dans `head` (nullable).
- Deux jeux de composants (`layout/` vs `sections/`, `ui/cta-band` vs `sections/cta-band`, `faq/faq-list` vs `sections/faq-list`) → **toujours les app-first**.

---

## 4. Modèle de données (une seule source de vérité)

| Module | Champ à ajouter | Pages consommatrices |
|---|---|---|
| `src/lib/data/team.ts` | `bio?: Record<Locale,string>` (9 membres + 4 mentors) | `/a-propos` (aperçu) + `/equipe` (détail) |
| `src/lib/data/press.ts` | `url?: string`, `linkStatus?: "ok"\|"broken"\|"unverified"` | home/a-propos (compact) + `/presse` (complet) |
| `src/lib/data/events.ts` | séparer PVinMotion / Swiss PV meeting ; `description?`, `upcoming?: boolean` | `/voyage` (past) + `/evenements` (tous) |
| `src/lib/data/partners.ts` | `url?: string` (7 partenaires) | home + `/partenaires` |
| nouveau `src/lib/data/sponsors.ts` | 22 sponsors : `name, category, logo, url` | `/sponsoring` (+ badge catégorie) |
| nouveau `src/lib/data/blog.ts` | 5 posts : `slug, title, date, excerpt, body` (Record<Locale>) | `/blog` |
| `src/lib/constants.ts` | `YOUTUBE` (docu `6ScnYhFPv5w`, crowdfunding `ZGMaSStYKDw`), `LINKEDIN`, `POLAR_STEPS_URL` complet, `WEMAKEIT_URL` | home, `/crowdfunding`, footer |
| `src/lib/i18n/*.json` | blocs dict des 7 pages (FR à fournir, EN/DE/IT à produire) | toutes |

Règles :
- Les sections existantes (home partenaires, a-propos équipe/presse, voyage events) **basculent sur les mêmes modules** → zéro duplication, mise à jour centralisée.
- Politique **liens presse/sponsors cassés** : `linkStatus: "broken"` → la carte affiche le titre sans lien cliquable + pastille discrète ; le `--check-links` du scraper alimente ce statut (sortie `🔴`).

---

## 5. Navigation & footer — points de code exacts

- **Nav items** : `mainNav` dans `src/lib/navigation.ts` (une seule liste → desktop + mobile). Ajouter/regrouper les items avec `children` (dropdown existant : hover/focus, panneau `absolute min-w-60`). Labels : `dict.nav.<key>`.
- **Footer** : colonnes construites dans `buildFooterProps` (`src/routes/_site/$lang.tsx`), `columns[]` → proposer 4 colonnes : « Le projet » (À propos, Équipe, Partenaires), « Le van » (Conversion, Solaire, Habitat, Impact), « Actualités » (Voyage, Blog, Presse, Événements), « Soutenir » (Don, Sponsoring, Crowdfunding) + colonne contact. Ajouter les liens légaux existants.
- **Breadcrumbs** : chaque nouvelle page passe par `PageHero` avec `crumbs` (label `dict.breadcrumb.<page>`) → JSON-LD BreadcrumbList automatique.
- Lang-switcher : fonctionne déjà (conserve le chemin de la page).

---

## 6. Composants/UI à créer (minimal)

- `@/components/sections/` non utilisé → créer côté app si besoin de cartes génériques : plutôt **copier les cartes existantes** (§3.3) pour la 1re livraison ; factoriser en composants (`TeamCard`, `PressCard`, `EventCard`, `PartnerCard`, `BlogCard`) **au 2e passage** si réutilisés ≥ 2 fois (home + page dédiée). Recommandation : factoriser d'emblée `PressCard` (3 usages : home, a-propos, presse) et `EventCard` (2 usages) ; garder le reste en JSX local.
- `PageHero` convient tel quel (hero simple). Pas de nouveau composant de layout.

---

## 7. Qualité & cohérence (checklist avant commit)

- [ ] `vpr check` (lint + type-check) passe ; `vpr fmt` appliqué.
- [ ] `vp dev`/`vp build` régénèrent `routeTree.gen.ts` ; les 7 routes répondent (200) sur les 4 locales ; URL invalide → 404 localisé.
- [ ] Pas de duplication : sections existantes et nouvelles pages lisent les mêmes modules `data/*.ts`.
- [ ] Sitemap : `GET /sitemap.xml` contient les nouvelles pages ×4 locales avec hreflang ; `llms.txt` à jour.
- [ ] Contenu vérifié : `--check-links` du scraper ; liens 🔴 exclus/cliquables seulement si OK ; vidéos YouTube embed public OK.
- [ ] Perf : nouvelles images locales passées dans `scripts/generate-image-variants.mjs` + entrées `srcSetFor` ; sections avec `content-visibility:auto` ; pas d'icônes dans loaderData.
- [ ] Desktop ≤ 6 items nav ; mobile : menu lisible (dropdowns → sous-listes indentées, pattern existant).
- [ ] Traductions complètes des 4 dicts (clés manquantes interdites en prod).
- [ ] **Fidélité** : textes copiés **verbatim** depuis la source (FR si page FR réelle, sinon EN) — aucun bloc paraphrasé (audit : `content-recovery-plan.md` §10).
- [ ] **Fidélité chiffres** : uniquement des valeurs sourcées ; 81 % CO₂, « près de 30'000.- », specs techniques validées par le client avant publication (écarts §10.4 du plan de récupération).

---

## 8. Ordre de livraison recommandé (phases)

| Phase | Contenu | Risque | Justification |
|---|---|---|---|
| 0 | Squelettes : modules `data/*.ts` étendus + blocs dict ×4 (à blanc) + `STATIC_PATHS` + routes vides avec PageHero + registrations SEO | — | Socle commun, testable immédiatement |
| 1 | `/presse` + `/evenements` (réutilisent `press.ts`/`events.ts` existants) | Faible | Données déjà présentes, ajout `url`/descriptions |
| 2 | `/equipe` (bios depuis la source) + `/partenaires` (URLs) | Moyen | Contenu client à relire (bios) |
| 3 | `/sponsoring` (22 logos) + `/crowdfunding` (vidéo/wemakeit) | Moyen | Logos/liens à valider |
| 4 | `/blog` (5 posts traduits) + enrichissements (home valeurs, conversion 4 charges + galerie, solaire SolarImpulse, impact 81 % + OFEV, voyage dates + awareness) | Moyen | Gros volume de copy ×4 langues |
| 5 | Nav restructurée (dropdowns) + footer 4 colonnes + liens croisés (home → presse/equipe/partenaires, a-propos → equipe/presse) | Moyen | Touche au global → en dernier, une fois les pages stables |
| 6 | QA finale : `vpr check`, crawl sitemap, revue mobile, perf Lighthouse | — | — |

Estimation : ~4-6 jours de dev, hors validation client et fourniture/traduction de contenu (voir `content-recovery-plan.md` §8).

---

## 9. Audit du plan de récupération — points manquants identifiés et comment les combler

Audit croisé du `content-recovery-plan.md` contre le code et le site source :

1. **Page `/equipe` vs section actuelle** : le plan crée une page mais `/a-propos` affiche déjà l'équipe (avec rôles depuis `dict.about.teamRoles`) → combler : `/a-propos` passe en **aperçu** (noms + lien « voir l'équipe ») pour éviter le doublon visuel. Décision documentée dans `content-recovery-plan.md` §5.3.
2. **Impact du déplacement « Impact sous Le van ▾ »** : rien à coder (URL inchangée `/impact`), seulement la nav. Ajouté à l'IA (§2.2).
3. **`dict.home.press` inutilisé** : le plan s'appuie dessus pour la future page presse → combler : soit réutiliser la carte presse de `/a-propos` sur la home (objectif actuel de la clé), soit nettoyer la clé morte. À décider en phase 1.
4. **Pas de page détail pour le blog/événements** : le plan de récupération liste des posts/événements sans pages détail → risque SEO « contenu riche sans page cible » faible au volume actuel (5 posts) ; combler plus tard par `$slug` (sitemap boucle type « services »). Noté §3.5.
5. **Médias lourds** : vidéo hero source (mp4 CDN) et galerie conversion → combler : récupérer via `--media`, convertir en `.webp`/`.mp4` locaux (pattern « local-media » déjà appliqué en juin 2026), éviter le hot-linking du CDN source.
6. **Traductions DE/IT** : le plan ne précise pas la chaîne → combler : **FR depuis la source FR quand elle existe (14 pages), sinon traduire depuis la source EN** ; EN copié de la source EN ; DE/IT = traduction à relire par le client. Les pages FR fallback EN (`/fr/about-soleva`, `/fr/blog`, `/fr/news`, `/fr/search`) et les pièges FR (titre FR de `/fr/solar-van`, titre cassé `/fr/events`, H1 EN de `/fr/habitat`) sont documentés au §10.6 du plan de récupération.
7. **Checklist technique du volet récupération** : aucun contrôle « contenu encore vivant » (dates 2022-2024, événement 04.10.2024 passé) → combler : statut `upcoming/past` dans `events.ts` et affichage adapté. Documenté dans le plan §8.

---

## 10. Exigence « copier-coller » : conséquences concrètes pour l'intégration

L'audit de fidélité (`content-recovery-plan.md` §10, verdict ~3/10) impose une règle de travail stricte : **on modernise le UI/UX, on ne réécrit pas les textes du client**. Conséquences sur le code et le process :

### 10.1 Stratégie de langue (par bloc de contenu)
| Locale | Source | Règle |
|---|---|---|
| `fr` (défaut) | page FR source quand elle existe (14 pages) | **copier verbatim** |
| `fr` (pages sans FR) | source EN (about-soleva, blog, news, search…) | traduire depuis l'EN — marqué « traduction » |
| `en` | source EN (20 pages) | **copier verbatim** |
| `de`, `it` | aucune source | traduire depuis FR/EN — **à relire client** |
| UI (labels nav, CTA, meta SEO) | libre | modernisation OK (non éditorial) |

### 10.2 Conséquences sur les modules de données existants
- `src/lib/data/services.ts` : `fullDescription`/`features`/`process`/`faqs` actuels = réécriture/invention → **remplacer par le texte source** (process source = 5 étapes-images, pas nos 4 ; FAQ source inexistante → FAQ à valider client ou retirer).
- `src/lib/constants.ts` `KEY_FIGURES` : chiffres non sourcés (250 km, 55 kWh, 1 350 W…) → **retirer du rendu public tant que non validés** ; garder les valeurs sourcées (81 %, 29'000+ CHF, 130 contributeurs, 30'000 km/an).
- `sponsor-tiers.ts` : formules inventées (CHF 500/1 500/5 000+) → remplacer par les catégories de partenaires de la source (logos) ou passer en validation client.
- `press.ts` : ajouter `url` + date seulement si sourcée (24Heures : pas de date sur la source → omettre ou valider).
- `events.ts` : noms/dates sources ✔ ; descriptions à copier verbatim ; statut `upcoming/past`.
- `faqs` / dict `faq` : page sans source → conserver mais chaque Q/R passe en validation client.

### 10.3 Impact sur les phases (§8)
- **Phases 1-4 (contenu)** : chaque bloc est **copié-collé** depuis `content-export/soleva.org/<lang>/<slug>.json` (sortie du script) — pas de rédaction maison ; les valeurs non sourcées sont exclues du rendu tant que le client n'a pas validé.
- **Phase 5 (nav)** : inchangée — les labels de nav restent les nôtres (UI).
- **Phase 6 (QA)** : ajouter un contrôle « fidélité » : diff texte source ↔ texte livré, par bloc ; vérifier l'absence de chiffres non sourcés ; vérifier la matrice FR (§10.6 du plan de récupération).

### 10.4 Contenus « maison » tolérés (marqués, pas inventés)
- Blocs **sans équivalent source** (FAQ, hero/vision/timeline de `/a-propos`, détails habitat/comfort) : conservés mais **chacun étiqueté `contenu-maison → validation client`** dans le code (TODO) pour ne pas les confondre avec du texte source.
- Legal/privacy : remplacer par le texte AGB source (déclarations réelles du client), en laissant l'adresse en backlog (source incohérente, §10.4-17 du plan de récupération).
