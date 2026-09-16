# Soleva — Migration du site : rapport d'état (présentable au client)

> Source de vérité : **le site actuel déployé `https://soleva.org`** (contenus, chiffres, dates, textes). Règle appliquée : **ne rien réinventer** — les textes éditoriaux sont repris tels quels depuis `soleva.org`, langue par langue ; seul le design/UI est modernisé.
> Date : 2026-09-02 · Cible : `https://soleva.the-corner.io` (fr / en / de / it)

---

## 1. Objectif

Moderniser le site Soleva (design, navigation, performance) **sans perdre le contenu existant**, que l'équipe juge essentiel : reprise du maximum de textes, chiffres, médias et liens du site actuel, en français et en anglais.

## 2. Ce qui a été fait

### 2.1 Analyse comparative des deux sites
- Inventaire complet du site actuel (20 pages) et du site cible (13 pages) — correspondances page par page établies.
- Le site actuel est une application Angular (CMS Megaphone) : son contenu n'est pas visible dans le HTML classique. Nous avons trouvé et validé **deux méthodes d'extraction fiables** : le rendu « moteur de recherche » (le serveur renvoie alors la page complète) et l'interface du CMS (données structurées : titres, descriptions SEO, images, vidéos).

### 2.2 Récupération complète du contenu actuel
- **Export de référence des 29 pages** (16 anglaises + 13 françaises) : textes, titres, listes, liens, images — stocké dans le projet et régénérable à tout moment.
- **Vérification des liens** : sur 43 liens externes contrôlés, **2 liens morts** détectés (Rouge FM — podcast disparu, Justin Burks Design — site expiré) ; 19 liens sont des protections anti-bot (LinkedIn, RTS, 24Heures…) : vraisemblablement valides dans un navigateur, à revérifier.
- Bonus : **profils LinkedIn de 11 membres/mentors** récupérés depuis le site actuel.

### 2.3 Audit de fidélité des textes (source de vérité : soleva.org)
- Verdict : les textes actuellement en ligne sur le nouveau site étaient **à ~30 % fidèles** à l'original (le reste avait été réécrit). Tout le travail de contenu est donc orienté **copier-coller** depuis l'original.
- Cross-audit factuel de 31 affirmations : les **8 chiffres « techniques » actuellement affichés n'existent pas sur l'original** (≈250 km, 55 kWh, 1 350 W, moteur Nissan, 150 km/jour, « 100 communes », 29'583 CHF / 147 % / objectif 20'000…) ; l'original annonce p. ex. « près de 30'000.- CHF », « plus de 130 contributeurs » et **81 %** de réduction CO₂ (nous affichons 80 %).

### 2.4 Nouvelles pages implémentées (7) — textes repris de l'original
| Page | Contenu (source) |
|---|---|
| **Équipe** | 9 membres + 4 mentors : bios, rôles, e-mails, LinkedIn — repris de l'original (FR + EN) |
| **Presse & médias** | 9 médias (RTS, 24Heures, SRF, RSI, La Côte…) avec liens vers les articles — lien cassé exclu |
| **Événements** | Les événements/salons passés (documentaire, Vanlife Expo, PVinMotion…) |
| **Partenaires** | 7 partenaires (CSEM, EPFL, Studer Innotec, BRUSA, SiL, Canton de Vaud, Energy Lab) avec liens |
| **Blog** | Les 5 actualités de l'original (titres/dates/textes) |
| **Sponsoring** | 22 sponsors/collaborations/médias partenaires en 3 catégories (16+4+2) avec liens |
| **Crowdfunding** | Récit de la campagne 2022 repris mot pour mot + vidéo de présentation + IBAN/BCV |

### 2.5 Interface, navigation et référencement
- **Navigation restructurée** (≤ 6 groupes avec menus déroulants) pour accueillir les nouvelles pages sans surcharger la barre.
- **Pied de page** réorganisé en 4 colonnes.
- Référencement : chaque page a titre/description SEO, URL canonique, versions 4 langues, fil d'Ariane structuré ; le plan de site (sitemap) inclut automatiquement les 7 nouvelles pages ×4 langues (80 URLs).
- Audit qualité (4 volets : traductions, contenus, SEO, UI) : **aucun problème bloquant** ; corrections appliquées (traductions localisées, date non sourcée retirée, cohérence visuelle).

## 3. État actuel — ce qui est prêt / ce qui reste

### ✅ Fait
- Export complet du contenu original (29 pages) + rapport des liens.
- 7 nouvelles pages construites avec les textes de l'original.
- Architecture de navigation/footer/sitemap adaptée.
- Corrections issues des audits (traductions ×4, fidélité, UI).

### ⏳ En attente de votre validation (points bloquants de contenu)
1. **Chiffres techniques** : faut-il publier les valeurs actuellement affichées (autonomie ≈250 km, 55 kWh, 8 modules VW, moteur Nissan, 1 350 W, 150 km/jour) ? Elles **n'apparaissent pas sur le site actuel** — si ce sont les bonnes valeurs du projet, nous les garderons ; sinon nous les retirons (règle : aucun chiffre non sourcé).
2. **Réduction CO₂ : 80 % ou 81 % ?** Le site actuel annonce 81 % (en incluant l'« énergie grise ») — nous alignerons sur 81 %.
3. **Crowdfunding** : afficher comme l'original (« près de 30'000.- », « plus de 130 contributeurs », « 1 mois en été 2022 ») ou conserver les chiffres précis actuels (29'583 CHF, 147 %) ?
4. **Tour de Suisse** : l'original donne les dates (15 juin – 3 août 2024) et « premier véhicule 100 % autonome à faire le tour de la Suisse » ; les « 100+ communes » et l'itinéraire détaillé ne sont pas sur l'original — à confirmer.
5. **Bios d'équipe** : reprises de l'original (FR/EN) — relire ; deux membres (Lucanaël Kopf, Roman Schmitz) n'ont **pas de biographie** sur le site actuel : texte à fournir si souhaité.
6. **Liens presse cassés** : le podcast Rouge FM et le partenaire Justin Burks Design pointent vers des pages mortes — liens remplacés ? sinon, affichés sans lien.
7. **FAQ** : le site actuel n'a pas de page FAQ — nos questions/réponses sont rédigées par nos soins : à valider ou à corriger.
8. **Adresse** (point déjà en attente) : l'original est incohérent (Renens sur la page crowdfunding, Lausanne dans le pied de page et les mentions légales) — décision à prendre.
9. **Traductions allemand/italien** : le site actuel n'existe qu'en FR/EN — nos versions DE/IT sont des traductions à faire relire.
10. **Divers** : logo presse RSI manquant, favicon personnalisé, n° IDE, page LinkedIn (profil trouvé à intégrer), fichiers sources des logos sponsors (sinon récupération depuis l'original).

### ⏳ Reste à faire (technique)
- **Mettre les pages existantes au même niveau de fidélité** (accueil, à-propos, van, impact, voyage, soutenir : textes à remplacer par ceux de l'original + retrait des chiffres non sourcés) — c'est le plus gros lot restant.
- Récupérer les **visuels** (photos galerie, logos sponsors manquants) depuis l'original et les intégrer localement.
- Contrôle final complet (qualité de code, tests visuels 4 langues, mobile, performance) avant mise en ligne.

## 4. Prochaines étapes (proposition)

1. **Vous nous validez les 10 points ci-dessus** (surtout les chiffres techniques et la formulation crowdfunding/tour) — nous en avons besoin pour terminer le contenu.
2. Nous appliquons la **fidélité complète aux pages existantes** (2-3 jours ouvrés).
3. Intégration des **visuels** + contrôles finaux.
4. **Recette** : vous vérifiez le site sur un lien de préproduction, puis mise en ligne.

## 5. Verdict — présentable au client ?

**Oui, comme point d'étape de la migration** : le périmètre est clair, l'essentiel du contenu manquant est récupéré, les 7 nouvelles pages sont construites sur la base de vos textes (rien d'inventé), et les décisions restantes sont identifiées et listées ci-dessus.

**Non, pas encore pour une mise en production** : les textes des pages existantes doivent encore être alignés sur l'original et vos validations de contenu (points 1-10) sont requises avant le lancement.
