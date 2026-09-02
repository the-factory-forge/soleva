# Plan de récupération de contenu — soleva.org → soleva.the-corner.io

> Branche : `feat/content-recovery` · Site cible : `soleva.the-corner.io` (TanStack Start, 4 locales fr/en/de/it)
> Site source : `soleva.org` (CMS Megaphone / Angular). Document décisionnel — les décisions client prises le jour de la rédaction sont intégrées (voir §4).
> Récupération automatisée : `scripts/scrape-soleva-org.mjs` (voir §2 et le fichier).
> ⚠️ Exigence clé (décision client) : **ne rien réinventer** — les textes éditoriaux sont **copiés-collés verbatim** depuis le site source, langue par langue (audit de fidélité : **§10**). Le design/UI seul est modernisé.

---

## 1. Contexte

Le client valide le design du nouveau site mais considère qu'il manque **beaucoup de contenu** par rapport à son site historique `soleva.org`. Ce plan :
1. documente **d'où** on peut récupérer le contenu (méthode éprouvée, §2) ;
2. donne l'**inventaire comparé** des deux sites (§3) ;
3. fixe le **périmètre** avec les décisions client (§4) ;
4. liste **page par page** ce qu'il faut récupérer / créer / enrichir (§5-§6) ;
5. liste les **liens externes et médias** récupérés (§7) ;
6. pose la **checklist de validation** client (§8) et le **backlog** (§9).

Le volet « comment bien intégrer ces pages dans le site (IA, UI/UX, registrations SEO) » est traité dans le document compagnon `docs/content-integration-plan.md`.

---

## 2. Sources de contenu récupérables (méthodes validées le jour de l'analyse)

Le site source est un **SPA Angular** : le HTML livré à un navigateur normal est vide (contenu chargé en JS). Deux portes d'entrée fonctionnelles donnent accès à **tout** le contenu :

### 2.1 Rendu serveur pour les bots (source de texte principale)
Avec le user-agent `Googlebot`, `soleva.org` renvoie la page **entièrement rendue par le serveur** (Angular SSR, ~460 Ko/page, contenu réel dans le DOM).

```
User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```

Exemple vérifié : `GET https://soleva.org/en/blog` → H1 "Blog", liste complète des posts, dates, textes, images.
→ Toutes les pages sont extractibles (titres, H1-H3, paragraphes, listes, liens, images).

### 2.2 API CMS Megaphone (source de données structurées + médias)
L'API publique du CMS, protégée par une simple vérification d'origine :

```
GET https://api.megaphone.info/v1/websites/37/pages
Headers: Origin: https://soleva.org · Referer: https://soleva.org/en/ · Accept: application/json
```
- `websiteId` = **37** (Soleva).
- Renvoie les 20 pages : `id`, `slug`, `title`, `attributes` (hero, listes, médias), `seo` (title/description/keywords), catégories, auteurs, dates.
- Médias hébergés sur CDN public : `https://d1oh1gq3c6bbc1.cloudfront.net/public/media/...` et `https://megaphone-data.s3.eu-central-2.amazonaws.com/public/media/...` (téléchargeables directement, version `.webp` fournie via `optimizedPath`).
- Sitemap complet : `https://soleva.org/sitemap.xml` (20 routes + alternates hreflang en/fr).

### 2.3 Limites connues de la source
- Les **blocs de texte intermédiaires** des pages (paragraphes édités dans le CMS) ne sont **pas** dans l'API `/pages` (seuls les layouts le sont) → les récupérer du **rendu SSR** (§2.1).
- Certaines zones sont **lazy/client-only**, absentes du SSR : logos du `/en/partners`, carte Google Maps du contact, formulaire newsletter, sous-menus mobiles. → Ces contenus se récupèrent via l'API ou se reconstruisent (logos partenaires = déjà sur la home carrousel du site source).
- Les pages FR incomplètes du site source (`/fr/about-soleva`, `/fr/blog`, `/fr/news`, `/fr/search`) retombent en **anglais** malgré une URL `/fr/`. Ne pas utiliser ces pages comme source FR ; le site source n'est **pas** une source de traduction FR fiable (on part de l'EN + traduction maison, cf. §8).

### 2.4 Script de récupération
`scripts/scrape-soleva-org.mjs` (livré sur cette branche) automatise tout : crawl SSR des pages EN+FR, appel API Megaphone (SEO + médias), vérification HTTP des liens externes (`--check-links` : **liens cassés marqués `🔴` dans la sortie**), téléchargement optionnel des médias (`--media`). Sortie JSON par page dans `content-export/soleva.org/<lang>/<slug>.json` + `index.json`.

```sh
node scripts/scrape-soleva-org.mjs --langs=en,fr --check-links          # texte + SEO + statut liens
node scripts/scrape-soleva-org.mjs --media                              # + téléchargement des médias
node scripts/scrape-soleva-org.mjs --limit=3                            # test rapide (3 pages)
```

---

## 3. Inventaire comparé des deux sites

### 3.1 Pages du site source (20)
`/` (home) · `/about-soleva` · `/agb` · `/auth` · `/blog` · `/contact-us` · `/crowdfunding` · `/electric-conversion-van` · `/environmental-impact` · `/events` · `/habitat` · `/journey` · `/news` · `/partners` · `/search` · `/sitemap` · `/solar-van` · `/sponsoring` · `/team` · `/under-maintenance`
(FR déclarée pour 14 d'entre elles ; les 6 autres sont EN-only.)

### 3.2 Pages de notre site (13 publiques)
`/` (home) · `/a-propos` · `/voyage` · `/soutenir` · `/faq` · `/contact` · `/habitat` · `/impact` · `/le-van` (hub) · `/le-van/conversion-electrique` · `/le-van/systeme-solaire` · `/mentions-legales` · `/confidentialite`

### 3.3 Correspondance et verdict

| Site source | Notre site | Verdict | Action |
|---|---|---|---|
| Home (héro + 5 valeurs + médias + get involved + partenaires + incendie) | Home | ⚠️ | Enrichir : §5.1 |
| `/about-soleva` (vision, éducation, docu, goal, où on en est) | `/a-propos` | ⚠️ | Enrichir : §5.2 |
| `/team` (9 bios + 4 mentors) | équipe dans `/a-propos` (noms + rôles) | ❌ | Créer `/equipe` + bios : §5.3, §6.1 |
| `/news` (page presse, 9 médias + liens) | presse sur home + `/a-propos` | ❌ | Créer `/presse` : §5.4, §6.2 |
| `/blog` (5 posts) | rien | ❌ | Créer `/blog` : §5.5, §6.3 |
| `/events` (5 événements détaillés) | 4 événements dans `/voyage` | ❌ | Créer `/evenements` : §5.6, §6.4 |
| `/partners` | partenaires sur home (7 logos) | ❌ | Créer `/partenaires` : §5.7, §6.5 |
| `/sponsoring` (22 logos sponsors) | formules dans `/soutenir` | ⚠️ | Créer `/sponsoring` (logos) : §5.8, §6.6 |
| `/crowdfunding` (vidéo + wemakeit + IBAN) | section crowdfunding dans `/soutenir` | ⚠️ | Créer `/crowdfunding` : §5.9, §6.7 |
| `/contact-us` (formulaire) | `/contact` (email CTA) | ✅ décision | **Pas de formulaire** : §4.3 |
| `/electric-conversion-van` | `/le-van/conversion-electrique` | ⚠️ | Enrichir : §5.10 |
| `/solar-van` | `/le-van/systeme-solaire` | ⚠️ | Enrichir : §5.11 |
| `/environmental-impact` | `/impact` | ⚠️ | Enrichir : §5.12 |
| `/journey` (tour + awareness) | `/voyage` | ⚠️ | Enrichir : §5.13 |
| `/habitat` | `/habitat` | ✅ | Rien (déjà plus riche que la source) |
| `/agb` (légal complet) | `/mentions-legales` + `/confidentialite` | ⚠️ | Écarts adresse → backlog (§9) |
| Footer newsletter | footer sans newsletter | ➖ | **Abandonné** : §4.4 |
| `/search`, `/sitemap`, `/auth`, `/under-maintenance` | — | ➖ | Hors périmètre |
| — | `/faq`, `/le-van` hub, 4 langues, `/mentions-legales` | ✅ | Bonus (pas dans la source) |

---

## 4. Décisions & périmètre (validées avec le client)

1. **Adresse** (Ave de Cour 19 Lausanne vs Rue de Lausanne 64 Renens) → **backlog**, on n'y touche pas pour l'instant. On conserve nos coordonnées actuelles.
2. **Bios d'équipe** → **reprendre le contenu du site original tel quel** ; les conflits (postes/parcours datés) seront traités **au cas par cas** avec le client.
3. **Liens presse** → **reprendre ce qui est récupérable** ; **les liens cassés seront marqués en rouge** (`🔴`) dans les sorties du script et **non publiés en cliquable** sur le site tant qu'ils ne sont pas corrigés.
4. **Newsletter** → **pas de newsletter, pas de gestion d'e-mails** (non retenu). Le composant footer `newsletter` ne sera pas branché. (À rediscuter avec le chef si besoin.)
5. **Formulaire de contact** → **aucun formulaire sur la page contact** ; l'**adresse e-mail est affichée** (mailto visible). Pas d'envoi d'e-mails à gérer.
6. Autres points « à voir » listés en backlog (§9).
7. **Fidélité stricte des textes (audit §10)** : les textes éditoriaux repris du site source sont **copiés-collés verbatim** (FR depuis la source FR quand elle existe, sinon EN) — aucune réécriture créative ; les éléments UI (labels nav/CTA/boutons, meta SEO) restent libres de modernisation ; tout contenu **sans source** ou **chiffre absent de la source** est supprimé ou marqué « à valider client ». Verdict de l'audit : nos textes actuels sont ~3/10 fidèles → gros travail de remplacement, page par page (§10).

---

## 5. Contenu détaillé à récupérer / créer / enrichir

### 5.1 Home — à enrichir
Récupérer depuis la home source (SSR `/en/`) :
- **5 blocs de valeurs** (avec icônes/titres/paragraphes) :
  1. **100 % solar** — « A van fully powered by the free, renewable energy of the sun, produced using solar panels carried on board »
  2. **circular design** — « Instead of a new product, we upcycle and retrofit an existing car to a second, green life »
  3. **travel sustainably** — « Fully self-sufficient. Move around anywhere with zero CO2 emissions… »
  4. **save money** — « Drive up to 30'000 km per year for free without external charging and cheaper than a new electric car »
  5. **Self-sustained housing** — « An off-grid, renewably powered but comfortable living space built with reused and recycled materials »
- Section **« Get involved »** : 2 blocs — « join the team » → CTA contact ; « technical partner and sponsor » → CTA sponsoring.
- Section médias : renvoi vers le documentaire YouTube (`https://www.youtube.com/watch?v=6ScnYhFPv5w`) et la page presse.
- (Les sections « partenaires », « incendie / nouveau départ », « documentaire » existent déjà chez nous ; le `dict.home.press` est présent mais inutilisé → à relier à la future page `/presse`.)

### 5.2 `/a-propos` — à enrichir
Récupérer : section « éducation & sensibilisation » (formation des ingénieurs, événements, éducation au voyage durable), « our goal » et « where we are standing today » (état d'avancement). Renvoyer vers `/equipe` et `/presse` au lieu de tout afficher en interne.

### 5.3 Équipe — bios (source : `/en/team`)
9 membres avec **bio détaillée + e-mail + photo** (photos déjà en local `public/images/team/*.webp`) :
Curdin Wüthrich (CEO — PhD fusion nucléaire EPFL, curdin.wuethrich@soleva.org), Matthieu Bourgois (CTO — ingénierie mécanique EPFL, formula student), Max Chevron (batteries — ex-consulting, EPFL hyperloop, max.chevron@soleva.org), Tobia Wyss (solaire — MSc EPFL énergie, tour du monde à vélo, tobia.wyss@soleva.org), Sara Bossuyt (comm — ingénieure environnement, sara.bossuyt@soleva.org), Sévane Bercher (juridique — droit Genève/Lausanne, sevane.bercher@soleva.org), Lucanaël Kopf (intégration mécanique), Roman Schmitz (électrification, roman.schmitz@soleva.org), Nicola Offeddu (habitat — PhD fusion EPFL, menuiserie).
4 **mentors** avec bio : Marc Müller (ICARE / Impact Living), André Hodder (EPFL moteurs électriques), Louis Palmer (SolarTaxi / SolarButterfly / WAVE), Prof. Dr. Werner Stednitz (HTW Berlin).
→ Données brutes dans la sortie du script ; à adapter dans `src/lib/data/team.ts` (champ `bio: Record<Locale,string>`).

### 5.4 Presse — page `/presse` (source : `/en/news`)
9 médias, **tous avec lien externe** (cf. §7.1). Nous avons déjà `pressAppearances` (`src/lib/data/press.ts` : média/type/date/langue) + `PRESS_LOGOS`. À ajouter : champ `url` + statut du lien. Compléter par le CTA source « Contact us for an interview ».

### 5.5 Blog — page `/blog` (source : `/en/blog`)
5 posts (dates + textes) :
1. 17.09.2024 — Solar openair cinema & doc premiere, 04.10.2024 (programme détaillé : concerts, courts-métrages Scholl & Franck Malléus, Marc Muller, avant-première docu)
2. 30.04.2024 — International PVinMotion conference, Neuchâtel 06–08.03.2024
3. 04.04.2024 — Soleva @ Roadtrip Expo, nov. 2023
4. 04.04.2024 — Annual Swiss Photovoltaics meeting, 21–22.03.2024
5. 04.04.2024 — Vanlife Expo Grenoble (coup de cœur), 04–05.05.2024
→ Nouveau module `src/lib/data/blog.ts` (idem `events.ts`, avec slug pour de futures pages détail si besoin).

### 5.6 Événements — page `/evenements` (source : `/en/events`)
Récupérer : bloc « upcoming » (doc premiere 2024 avec programme complet), bloc « past » (4 événements), CTA « HAVE AN EVENT… WE SHOULD VISIT? ». Écarts avec notre `events.ts` : séparer « PVinMotion Neuchâtel (06–08.03.2024) » et « Swiss Photovoltaics meeting (21–22.03.2024) » (actuellement fusionnés en « Congrès photovoltaïque Suisse 03.2024 ») ; ajouter descriptions et visuels (URLs CDN dans la sortie du script).

### 5.7 Partenaires — page `/partenaires` (source : home carrousel + API)
7 partenaires actuels affichés sur la home source avec **liens externes** : CSEM (csem.ch), EPFL (epfl.ch), Studer Innotec (studer-innotec.com), BRUSA (brusahypower.com), SiL (lausanne.ch), Canton de Vaud (vd.ch), Energy Lab Winner 2022 (energylab.site). Notre `partners.ts` a les noms/logos mais **pas les URLs** → les ajouter (cliquables uniquement si vérifiés).

### 5.8 Sponsoring — page `/sponsoring` (source : `/en/sponsoring`)
**22 logos** : Sponsors (16) : SiL, CSEM, Loterie Romande (loro.ch), Studer Innotec, Canton de Vaud (vd.ch), Energy Lab (energylab.site), BRUSA, EPFL, Renens (renens.ch), cork-shop (cork-shop.com), evshop (evshop.eu), Peugeot Grandjean Lausanne, Swiss Graphics Services, Shematic (shematic.ch), Tiny Stove (tiny-stove.com), vanmade (vanmade.de) — Collaborations (4) : Energiegenossenschaft Schweiz, heig-vd, CSM, BioLite — Media partners (2) : Megaphone, Justin Burks Design. + image « Sponsorship packages 2025 ».
→ Nouveau module `src/lib/data/sponsors.ts` (nom, catégorie, logo, url). Logos à télécharger du CDN (§2.2) et convertir en `.webp`.

### 5.9 Crowdfunding — page `/crowdfunding` (source : `/en/crowdfunding`)
Récupérer : **vidéo de présentation** (YouTube embed `ZGMaSStYKDw`), **widget/lien wemakeit** (`https://wemakeit.com/projects/soleva-solar-electric-van`), stats (29'000+ CHF, 130 contributeurs, été 2022 — déjà en base `KEY_FIGURES`), QR TWINT (image CDN), CTA « devenir sponsor ». (IBAN = identique au nôtre, cf. §7.4.)

### 5.10 `/le-van/conversion-electrique` — enrichir
Source `/en/electric-conversion-van` : argument **« double la durée de vie du véhicule »**, **4 façons de charger** (détail dans le SSR), galerie **« the conversion in images »** (5 étapes : remove thermal / integrate electric / battery pack / deployable solar / habitat, avec visuels), anecdote Peugeot J9 (1987, moteur diesel 190 kg).

### 5.11 `/le-van/systeme-solaire` — enrichir
Source `/en/solar-van` : mention **SolarImpulse** (panneaux construits par CSEM pour l'avion SolarImpulse), formulation « mobile solar plant », V2X (déjà présent).

### 5.12 `/impact` — enrichir
Source `/en/environmental-impact` : récit « Travelling vs Footprint », chiffre **transport = 32 % des GES en Suisse (OFEV 2019)**, contexte **interdiction EU des véhicules thermiques 2035**, comparaison chiffrée **−81 % CO₂ vs EV/diesel incl. énergie grise** (nous affichons 80 % — à faire trancher par le client, cf. §8).

### 5.13 `/voyage` — enrichir
Source `/en/journey` : **dates exactes du tour** (15.06 → 03.08.2024), « premier véhicule 100 % autonome à faire le tour de Suisse », section **« Spread awareness »** (3 actions : salons nationaux, réseaux sociaux/vidéos, rencontres entreprises/institutions). Lien Polar Steps complet : `https://www.polarsteps.com/SolevaSolarVan/11946872-the-swiss-tour`.

---

## 6. Nouvelles pages — récapitulatif d'implémentation

| Page | Route | Données | Notes |
|---|---|---|---|
| Équipe | `/equipe` | `src/lib/data/team.ts` + bios | Team peut rester en section de `/a-propos` (lien mutuel) |
| Presse | `/presse` | `press.ts` (+ `url`, `status`) | Réutilise `PRESS_LOGOS` + carte presse existante |
| Blog | `/blog` | nouveau `blog.ts` | 5 posts initiaux |
| Événements | `/evenements` | `events.ts` enrichi | Upcoming + past |
| Partenaires | `/partenaires` | `partners.ts` (+ `url`) | Reprend la grille de logos de la home |
| Sponsoring | `/sponsoring` | nouveau `sponsors.ts` | Tiers (déjà sur `/soutenir`) + **logos sponsors actifs** |
| Crowdfunding | `/crowdfunding` | `KEY_FIGURES` + vidéo + wemakeit | IBAN reste sur `/soutenir#donation` |

L'intégration (routes, i18n 4 langues, nav, SEO, sitemap, JSON-LD, composants, ordre de livraison) est détaillée dans `docs/content-integration-plan.md`.

---

## 7. Registre des URLs externes récupérées

### 7.1 Presse — liens (source `/en/news`)
Légende : 🟢 URL trouvée (à re-vérifier HTTP à l'intégration) · ⚠️ à contrôler (paywall / page archive / URL encodée) · 🔴 cassée (non publiée telle quelle).

| Média | Type | Date | Lien | Statut |
|---|---|---|---|---|
| RTS 19h30 | TV nat. | 23.06.2024 | https://www.rts.ch/play/tv/19h30/video/des-jeunes-ingenieurs-parcourent-la-suisse-avec-un-vieux-minibus-converti-a-lenergie-solaire?urn=urn:rts:video:15005664 | 🟢 |
| 24Heures | Presse | 12.06.2024 | https://www.24heures.ch/un-van-romand-100-electrique-et-solaire-442970221563 | 🟢 (paywall probable) |
| SRF Schweiz Aktuell | TV nat. | 29.08.2024 | https://www.srf.ch/play/tv/schweiz-aktuell/video/westschweizer-ingenieur-team-testet-solar-camper?urn=urn:srf:video:03a28bd6-8f49-432a-88c6-a40c7b8d75b7 | 🟢 |
| RSI | TV nat. | 13.07.2024 | https://www.rsi.ch/info/ticino-grigioni-e-insubria/Soleva-il-viaggio-“infinito”-di-passaggio-in-Ticino--2202193.html | ⚠️ (guillemets typographiques dans l'URL → encoder) |
| Télé Vaud-Fribourg | TV rég. | 06.04.2022 | https://latele.ch/emissions/radar-vaudois/radar-vaudois-s-2022-e-68 | 🟢 |
| RTS Radio Matinale | Radio nat. | 24.06.2022 | https://www.rts.ch/info/sciences-tech/13196779-avec-des-panneaux-solaires-sur-un-van-des-ingenieurs-veulent-voyager-durable.html | 🟢 (retirer le param `fbclid`) |
| Rouge FM | Radio | 30.06.2022 | https://www.rouge.com/podcasts/le-coup-de-projecteur-203/1 | ⚠️ (page série, épisode exact à confirmer) |
| LFM (2 parties) | Radio | 06.03.2022 | https://www.lfm.ch/podcasts/le-6-9-lfm-linvitee-qui-fait-lactu-09032022-0709-072706/ + https://www.lfm.ch/podcasts/09032022-0722-073859/ | ⚠️ |
| La Côte | Presse | 01.03.2022 | https://www.lacote.ch/vaud/la-cote/morges-district/morges-ville/morges-ils-transforment-leur-vieux-van-en-vehicule-solaire-1158291 | 🟢 |

### 7.2 Réseaux sociaux & médias
- Instagram : `https://www.instagram.com/soleva_solar_van/` (déjà en base)
- Facebook : `https://www.facebook.com/solevavan` (déjà en base)
- **LinkedIn (nouveau)** : `https://www.linkedin.com/company/solevavanproject/` → à ajouter (TODO actuel dans `constants.ts`)
- YouTube — documentaire : `https://www.youtube.com/watch?v=6ScnYhFPv5w` ; film crowdfunding : `https://www.youtube.com/embed/ZGMaSStYKDw`
- Polar Steps (tour) : `https://www.polarsteps.com/SolevaSolarVan/11946872-the-swiss-tour` (notre constante pointe `https://www.polarsteps.com/Soleva` → à aligner)
- Téléphone : `+41 77 420 74 40` · E-mail : `info@soleva.org` (identiques)

### 7.3 Partenaires / sponsors — URLs (cf. §5.7-5.8 ; liste complète dans la sortie du script)
CSEM, EPFL, Studer Innotec, BRUSA HyPower, SiL, Canton de Vaud, Energy Lab, Renens, Loterie Romande, cork-shop, evshop, Peugeot Grandjean, Swiss Graphics Services, Shematic, Tiny Stove, vanmade, Energiegenossenschaft Schweiz, heig-vd, CSM, BioLite, Megaphone, Justin Burks Design.

### 7.4 Coordonnées bancaires (déjà en base — vérifiées identiques)
IBAN `CH36 0076 7000 L553 2228 7` · BIC `BCVLCH2LXXX` · Banque Cantonale Vaudoise · Bénéficiaire ASSOCIATION SOLEVA · Référence « Donation au projet Soleva ».

---

## 8. Checklist de validation client (avant mise en ligne)

- [ ] Bios d'équipe relues (conflits postes/parcours au cas par cas) + photos.
- [ ] Liens presse re-testés (`--check-links`), 🔴 exclus ou corrigés ; accord sur les liens ⚠️.
- [ ] Chiffres : −80 % vs −81 % CO₂, « 30'000 km/an gratuits » (à reformuler ?), autonomie ~250 km, 1 350 W, 147 %/29'583 CHF (OK source).
- [ ] Traductions : FR fournie par le client ; EN/DE/IT à traduire/relire (le site source n'est pas fiable en FR, §2.3).
- [ ] Vidéos YouTube (documentaire, crowdfunding) : droit d'embarquer ces lectures (embed public).
- [ ] Logos sponsors : accord client pour l'affichage + fichiers sources si possible (sinon CDN).
- [ ] LinkedIn + favicon + IDE (cf. backlog).
- [ ] Dates/statuts « upcoming events » : l'événement du 04.10.2024 est passé → choisir affichage (archive) vs retirer.
- [ ] **Fidélité (§10)** : textes des pages/sections copiés **verbatim** depuis la source FR/EN (pas de paraphrase) ; bloc par bloc via `content-export/` (garde-fous §10.7).
- [ ] **Fidélité (§10.4)** : conflits chiffrés arbitrés avec le client — 81 % CO₂ (vs 80 %), specs techniques absentes de la source (250 km, 55 kWh, 1 350 W, moteur Nissan…), chiffres crowdfunding (« près de 30'000.- », pas de « 29'583 / 147 % / objectif 20'000 »), « 100+ communes » retiré.
- [ ] **Fidélité (§10.5)** : contenus inventés retirés ou validés — disclaimers « estimés », formules de sponsoring CHF 500/1 500/5 000+, FAQ maison, durée GA « 14 mois » ; privacy remplacée par le texte AGB source.

## 9. Backlog (hors périmètre actuel)

- Adresse légale : Ave de Cour 19 Lausanne (source footer/AGB) **vs** Rue de Lausanne 64 Renens (source crowdfunding + nôtre) → à trancher.
- Newsletter (abandonnée ; rediscuter avec le chef si besoin d'un canal).
- Formulaire de contact (abandonné ; e-mail affiché).
- Page `sitemap` HTML et `search` (utilitaires source) — non prioritaires.
- Numéro IDE (`constants.ts`), URL LinkedIn, favicon maison (placeholder The Corner).
- Robots.txt : autorisations IA-crawlers (GEO) — opportunité, hors sujet contenu.
- Réflexion : pages détail pour blog/événements (`$slug`) plus tard (le plan les garde en liste seulement).

---

## 10. Audit de fidélité des textes — on ne réinvente rien (copier-coller source)

> Audit réalisé texte-à-texte (nos dicts/data FR vs rendu SSR EN **et** FR du site source) par 3 sous-agents + **cross-audit factuel** (31 claims vérifiés dans la source). Verdict global : **~3/10 de fidélité** — la grande majorité de nos textes actuels sont des réécritures/inventions issues du template, pas des textes du client.

### 10.1 Scores par page (audit)

| Page (nôtre) | Fidèle | Remplacer | Sans source | Commentaire |
|---|---|---|---|---|
| Home | ~11 % | ~67 % | ~22 % | hero, **5 piliers** (source en a 5, nous 3 inventés), new_start, cta, problem, press |
| `/a-propos` (+ équipe/presse) | ~25 % | ~50 % | ~37 % | mission/vision, **rôles équipe** ; hero/story/timeline sans source directe |
| Partenaires (noms) | 100 % | 0 % | 0 % | à compléter par les URLs |
| `/le-van` hub | ~30 % | — | — | page UI ; sous-titre inventé |
| conversion / solaire / habitat / impact | 0–3/10 | quasi toute la page | FAQ, comfort, technical… | specs inventées ; 80 % vs 81 % |
| `/voyage` | 4/10 | 7 blocs | 7 blocs | « 100 communes », trajet inventés |
| `/soutenir` | 3/10 | 12 | 8 | chiffres crowdfunding, tiers inventés |
| `/contact` | 5/10 | 1 | 3 | e-mail seulement (décision client) |
| `/faq` | 0/10 | — | 100 % | pas de source → garder + valider client |
| légal + privacy | 3/10 | 8 | 5 | remplacer par le texte AGB source |
| footer/common | 2/10 | — | — | labels UI (modernisation libre) |

### 10.2 Règle par langue (copier-coller)

- **FR** : copier le texte du site source **FR** quand la page existe réellement en français (14 pages — matrice §10.6) ; sinon traduire depuis la source EN (jamais réinventer).
- **EN** : copier la source EN (20 pages, complète et fiable).
- **DE/IT** : **pas de source** → traduire depuis la source FR/EN, court et fidèle → chaque traduction est marquée « traduction à relire client ».
- **UI** (labels nav, boutons, CTA, meta SEO title/description, aria) : modernisation libre — non éditorial.
- **Absence de source** : notre texte actuel conservé mais marqué « contenu maison → validation client ».
- **Chiffre/date/fait absent de la source** : ne pas publier — supprimer ou passer en validation client (§10.4-§10.5).

### 10.3 Nouvelles pages → source de copie (verbatim)

| Page à créer | Source EN | Source FR réelle | Copier pour FR | Copier pour EN | DE/IT |
|---|---|---|---|---|---|
| `/equipe` | `/en/team` ✔ | `/fr/team` ✔ | bios FR verbatim | bios EN verbatim | trad. depuis FR/EN |
| `/partenaires` | `/en/partners` (SSR **vide**) | idem FR | noms + liens depuis la **home** (7) — liste à valider client | idem | idem |
| `/presse` | `/en/news` ✔ | `/fr/news` : corps FR réel, `<title>` EN | corps FR | corps EN | trad. |
| `/blog` | `/en/blog` ✔ | **EN-only** (`/fr/blog` retombe EN) | traduire depuis EN | corps EN | trad. |
| `/evenements` | `/en/events` ✔ | `/fr/events` : FR mais **titre FR cassé** | corps FR (vérifié) | corps EN | trad. |
| `/sponsoring` | `/en/sponsoring` ✔ | `/fr/sponsoring` ✔ | catégories + logos FR | idem EN | trad. |
| `/crowdfunding` | `/en/crowdfunding` ✔ | `/fr/crowdfunding` ✔ | texte FR verbatim | texte EN | trad. |

### 10.4 Faits & chiffres — état (cross-audit, 31 claims)

| # | Sujet | Notre valeur actuelle | Valeur source | Action |
|---|---|---|---|---|
| 1 | Réduction CO₂ | ~80 % | **81 %** (source, « incl. l'énergie grise des batteries et du moteur électrique ») | passer à 81 % |
| 2 | Autonomie | ~250 km | **absent de la source** | validation client ou retrait |
| 3 | Batterie | 55 kWh, 8 modules VW | **absent** (« battery modules » sans chiffre) | validation client ou retrait |
| 4 | Moteur | Nissan seconde main | **absent** (« an electric motor », sans marque) | validation client ou retrait |
| 5 | Solaire | 1 350 W, +150 km/jour | **absent** | validation client ou retrait |
| 6 | BRUSA | « BRUSA HyPower DC-DC » | BRUSA = logo partenaire ✔, mais « HyPower converter » **absent** | nuancer / valider |
| 7 | CSEM / EPFL PV-Lab | « développés par CSEM et EPFL PV-Lab » | CSEM ✔ (EN) ; « PV-Lab » absent des pages (cité dans un article presse) ; **la page FR solar ne cite pas CSEM** | suivre la langue de la source |
| 8 | Panneaux | « grêle, nid d'abeille, made in CH » | « lightweight, durable, withstand harsh weather » ✔ ; détails **absents** | valider |
| 9 | « 30'000 km/an gratuits » | absent de notre home | ✔ source (home « save money ») | récupérer |
| 10 | Conversion | — | ✔ « double la durée de vie », Peugeot J9 1987, moteur diesel 190 kg ; « 4 façons de charger » (titre ✔, détail non rendu côté client) | récupérer ; demander le détail au client |
| 11 | Impact | — | ✔ 32 % GES transport personnel CH (OFEV 2019) ; interdiction EU 2035 | récupérer |
| 12 | Tour | « 100+ communes », trajet Lausanne→Zurich via Davos/Lugano/Sion | dates 15.06→03.08.2024 ✔ ; « premier véhicule entièrement autonome à parcourir la Suisse » ✔ ; **« 100 communes » absent** | remplacer ; retirer l'itinéraire inventé |
| 13 | Crowdfunding | CHF 29'583 / 147 % / objectif 20'000 | **« plus de 29'000.- »**, « près de 30'000.- », « plus de 130 contributeurs », « 1 mois en été 2022 » — **pas de 147 %, pas d'objectif 20'000, pas de 29'583** (éventuellement dans le widget wemakeit) | texte source + valider les chiffres précis |
| 14 | Rôles équipe & mentors | rôles FR maison | ✔ rôles source (EN + FR) | copier verbatim par langue (typo FR « méchanique » à corriger avec le client) |
| 15 | Presse | 9 dates | 8 dates ✔ ; **24Heures sans date sur la source** | ne pas publier de date pour 24Heures (ou valider) |
| 16 | Documentaire 04.10.2024 | sur la home | ✔ sur `/events` source (pas la home) | citer depuis les événements |
| 17 | Adresse | Rue de Lausanne 64, 1020 Renens | source **incohérente** (footer Ave de Cour 19, 1007 ; AGB Ave de cour 19, 1000 ; crowdfunding Renens) + « Responsable : Curdin Wüthrich » omis chez nous | **backlog** — client arbitre |
| 18 | Privacy | « 14 mois GA », « GA4 » | logs serveur « max 7 jours » ; « Google Analytics » (pas GA4) | reprendre le texte AGB source |

### 10.5 Contenus actuels « inventés » → retirer ou valider client

- **3 disclaimers maison** (« Chiffres techniques estimés, en cours de validation », « Les caractéristiques techniques sont estimées… », « Toutes les estimations d'impact doivent être validées par Soleva ») — absents de la source → à retirer ou remplacer par le texte source.
- **Specs techniques non sourcées** : 250 km, 55 kWh, 8 modules VW, Nissan, 1 350 W, 150 km/jour, BRUSA HyPower, « grêle/nid d'abeille » → valider avec le client (données projet réelles possibles, mais hors site source).
- **Chiffres crowdfunding précis** (29'583 / 147 % / 20'000) → remplacer par les valeurs sources.
- **« 100+ communes » et l'itinéraire détaillé du tour** → remplacer par le texte source (dates + « premier véhicule autonome »).
- **Formules de sponsoring CHF 500 / 1 500 / 5 000+** (« logo van taille M/L ») → fabriquées ; la source affiche des **catégories de partenaires** (Sponsors / Collaborations / Partenaires médiatiques + logos) et un tableau image « Sponsorship packages 2025 » → à refaire à partir de la source ou valider.
- **FAQ entière** (pas de page FAQ source) → garder mais valider chaque Q/R avec le client.
- **Privacy/mentions maison** → remplacer par le texte AGB source (déclarations RGPD réelles du client).
- **Rôles d'équipe « co-fondatrice, juridique »…** → copier les rôles source (EN + FR) verbatim.

### 10.6 Matrice FR source (pages réellement en français — titre FR vérifié)

FR OK (14) : `/` (home FR), `/agb`, `/contact-us`, `/crowdfunding`, `/electric-conversion-van`, `/environmental-impact`, `/events`, `/habitat`, `/journey`, `/partners`, `/solar-van`, `/sponsoring`, `/team`, `/sitemap`.

Pièges (vérifier le **corps**, pas seulement le titre) :
- `/fr/about-soleva`, `/fr/news` : corps FR mais `<title>` EN (SEO FR à créer côté nôtre).
- `/fr/solar-van` : **titre FR identique à la page conversion** (« La technologie et spécifications… ») — clash à vérifier avant copie.
- `/fr/events` : **titre FR cassé** (« …sponsor-copie »).
- `/fr/habitat` : H1 reste EN (« Self-sustaining House On Wheels ») malgré un titre FR.
- `/fr/environmental-impact` : corps partiellement EN (fallback).
- FR source parfois approximative (« Habitation purement auto-suffisant et durable ») → copier tel quel ou corriger avec le client (jamais seul).

### 10.7 Garde-fous d'implémentation (copier-coller sans invention)

1. Flux de copie : sortie du script `content-export/soleva.org/<lang>/<slug>.json` → textes collés **verbatim** dans les dicts/modules — interdiction de reformuler.
2. Ne pas traduire soi-même FR→EN quand la source EN existe (copier l'EN), ni EN→FR quand une source FR existe (copier la FR).
3. Garder le format source (guillemets, chiffres, dates) ; ne jamais ajouter un chiffre absent de la source.
4. Valeur manquante ⇒ `TODO(client)` explicite ; **rien n'est publié avec un chiffre non sourcé**.
5. QA finale (phase 6 de l'intégration) : diff « texte source vs texte livré » par bloc.
6. Toute nouvelle page reprend le texte source complet (§10.3) — pas de synthèse maison.
