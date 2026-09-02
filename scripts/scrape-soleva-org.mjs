// scripts/scrape-soleva-org.mjs
// ---------------------------------------------------------------------------
// Récupération du contenu de https://soleva.org (CMS Megaphone / Angular SSR)
// vers un export JSON local, pour alimenter la migration de contenu
// (voir docs/content-recovery-plan.md).
//
// Méthodes (validées — voir le plan) :
//   1. Rendu SSR : GET des pages avec le user-agent Googlebot => HTML complet
//      (le site ne rend rien pour un UA navigateur normal).
//   2. API Megaphone : GET https://api.megaphone.info/v1/websites/37/pages
//      avec headers Origin/Referer => métadonnées SEO + médias par page.
//   3. (optionnel) Vérification HTTP des liens externes => liens cassés marqués
//      🔴 dans report.md et `linkStatus` dans les JSON.
//   4. (optionnel) Téléchargement des médias (images .webp, vidéos) du CDN.
//
// Usage :
//   node scripts/scrape-soleva-org.mjs --langs=en,fr
//   node scripts/scrape-soleva-org.mjs --check-links          # statut des liens
//   node scripts/scrape-soleva-org.mjs --media                # + téléchargement médias
//   node scripts/scrape-soleva-org.mjs --limit=3              # test rapide
//   node scripts/scrape-soleva-org.mjs --out=./tmp-export
//
// Sortie (par défaut, ignorée par git) :
//   content-export/soleva.org/<lang>/<slug>.json   - contenu extrait par page
//   content-export/soleva.org/index.json           - index + résumé + liens cassés
//   content-export/soleva.org/report.md            - rapport lisible (🔴 = lien cassé)

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://soleva.org";
const API_BASE = "https://api.megaphone.info/v1";
const WEBSITE_ID = 37; // id Megaphone du site Soleva (GET /v1/websites)

const UA_BOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const UA_BROWSER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

// Liste de secours si le sitemap ne répond pas (routes principales du site source).
const FALLBACK_PAGES = {
  en: [
    "/", "/about-soleva", "/agb", "/blog", "/contact-us", "/crowdfunding",
    "/electric-conversion-van", "/environmental-impact", "/events", "/habitat",
    "/journey", "/news", "/partners", "/solar-van", "/sponsoring", "/team",
    "/search", "/sitemap",
  ],
  fr: [
    "/", "/agb", "/contact-us", "/crowdfunding", "/electric-conversion-van",
    "/environmental-impact", "/events", "/habitat", "/journey", "/partners",
    "/solar-van", "/sponsoring", "/team",
  ],
};

// Pages utilitaires exclues par défaut (auth/under-maintenance) et pages incluses
// seulement avec --all (search/sitemap : contenu "chrome" du site).
const UTILITY = new Set(["/auth", "/under-maintenance", "/search", "/sitemap"]);

const HEADERS_HTML = { "user-agent": UA_BOT, accept: "text/html,*/*" };
const HEADERS_API = {
  "user-agent": UA_BROWSER,
  accept: "application/json",
  origin: ORIGIN,
  referer: ORIGIN + "/en/",
};
// Hôtes à ne JAMAIS "checker" (CDN média du CMS, embeds) — seulement les liens
// éditoriaux externes (presse, sponsors, réseaux...).
const CHECK_SKIP_HOSTS = new Set([
  "d1oh1gq3c6bbc1.cloudfront.net",
  "megaphone-data.s3.eu-central-2.amazonaws.com",
  "cloud.megaphone.info",
  "assets.megaphone.info",
  "api.megaphone.info",
  "unpkg.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "wemakeit.com",
  "google.com",
  "www.google.com",
  "policies.google.com",
  "jsapi.apiary.io",
]);

function parseArgs(argv) {
  const args = { langs: ["en"], out: "content-export/soleva.org", checkLinks: false, media: false, all: false, noApi: false, limit: 0, concurrency: 3, maxMediaMb: 25 };
  for (const a of argv) {
    if (a.startsWith("--langs=")) args.langs = a.slice(8).split(",").map((s) => s.trim()).filter(Boolean);
    else if (a.startsWith("--out=")) args.out = a.slice(6);
    else if (a.startsWith("--limit=")) args.limit = Number(a.slice(8));
    else if (a.startsWith("--concurrency=")) args.concurrency = Number(a.slice(14));
    else if (a.startsWith("--max-media-mb=")) args.maxMediaMb = Number(a.slice(15));
    else if (a === "--check-links") args.checkLinks = true;
    else if (a === "--media") args.media = true;
    else if (a === "--all") args.all = true;
    else if (a === "--no-api") args.noApi = true;
    else if (a === "--help") args.help = true;
  }
  return args;
}

// ---------- helpers HTML ----------

const ENTITIES = {
  "&amp;": "&", "&nbsp;": " ", "&quot;": '"', "&#39;": "'", "&apos;": "'",
  "&lt;": "<", "&gt;": ">", "&eacute;": "é", "&egrave;": "è", "&ccedil;": "ç",
  "&agrave;": "à", "&ucirc;": "û", "&icirc;": "î", "&ocirc;": "ô", "&ecirc;": "ê",
};

function clean(html) {
  let s = html.replace(/<[^>]+>/g, " ");
  for (const [k, v] of Object.entries(ENTITIES)) s = s.split(k).join(v);
  s = s.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)));
  return s.replace(/\s+/g, " ").trim();
}

function stripChrome(body) {
  // Retire les composants chrome du SSR Angular (nav/footer/quicklinks) quand ils
  // existent, pour limiter le bruit dans le texte extrait.
  let s = body;
  s = s.replace(/<megacms-(?:navbar|footer|quicklinks)[^>]*>[\s\S]*?<\/megacms-(?:navbar|footer|quicklinks)-component>/gi, " ");
  s = s.replace(/<([a-z0-9-]*?(?:nav|footer)[a-z0-9-]*)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  return s;
}

function scopeOf(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (main) return main[1];
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const raw = body ? body[1] : html;
  return stripChrome(raw).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
}

function extract(html) {
  const scope = scopeOf(html);
  const grab = (re) => [...scope.matchAll(re)].map((m) => clean(m[1])).filter((t) => t.length > 2);
  const h1 = grab(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2 = grab(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3 = grab(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);
  const paragraphs = grab(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  const listItems = grab(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  const anchors = [...scope.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({ href: m[1], label: clean(m[2]).slice(0, 200) }))
    .filter((l) => l.href && l.href !== "#");
  const links = {
    internal: [...new Set(anchors.filter((l) => l.href.startsWith("/")).map((l) => l.href))],
    external: [...new Set(anchors.filter((l) => /^https?:\/\//i.test(l.href)).map((l) => l.href))],
    mailto: [...new Set(anchors.filter((l) => l.href.startsWith("mailto:")).map((l) => l.href))],
    tel: [...new Set(anchors.filter((l) => l.href.startsWith("tel:")).map((l) => l.href))],
  };
  const images = [...new Set([...scope.matchAll(/<img[^>]*src=["']([^"']+)["']/gi)].map((m) => m[1]))]
    .filter((u) => /^https?:\/\//i.test(u));
  const title = clean(((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]) || "");
  return { title, h1, h2, h3, paragraphs, listItems, links, images };
}

function slugOf(pagePath) {
  const s = pagePath.replace(/\/+$/, "");
  return s === "" ? "home" : s.replace(/^\//, "").replace(/[^a-z0-9-]+/gi, "-");
}

async function fetchText(url, headers, timeoutMs = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, redirect: "follow" });
    const text = await res.text();
    return { status: res.status, text, finalUrl: res.url };
  } finally {
    clearTimeout(t);
  }
}

// ---------- API Megaphone (métadonnées + médias) ----------

async function fetchApiPages() {
  const res = await fetch(`${API_BASE}/websites/${WEBSITE_ID}/pages`, { headers: HEADERS_API });
  if (!res.ok) throw new Error(`API Megaphone HTTP ${res.status}`);
  const data = await res.json();
  const bySlug = new Map();
  for (const page of data.items || []) {
    const attrs = page.attributes || {};
    bySlug.set(page.slug || "/", {
      id: page.id,
      title: page.title,
      slug: page.slug,
      published: page.published,
      publishedDate: page.publishedDate,
      seo: page.seo || null,
      attributes: attrs,
      attachments: attrs.attachments || [],
      hideSidebar: attrs.hideSidebar,
      backgroundPosition: attrs.backgroundPosition,
    });
  }
  return bySlug;
}

// ---------- vérification des liens ----------

async function checkUrl(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(url, { method: "GET", headers: { "user-agent": UA_BOT }, redirect: "follow", signal: ctrl.signal });
      await res.body?.cancel();
      return { url, status: res.status, ok: res.ok, finalUrl: res.url };
    } finally {
      clearTimeout(t);
    }
  } catch (e) {
    return { url, status: 0, ok: false, error: e.name === "AbortError" ? "timeout" : e.message };
  }
}

async function checkAllLinks(links, concurrency) {
  const results = [];
  for (let i = 0; i < links.length; i += concurrency) {
    const chunk = links.slice(i, i + concurrency);
    results.push(...(await Promise.all(chunk.map((u) => checkUrl(u)))));
  }
  return results;
}

// ---------- médias ----------

async function downloadMedia(attachments, outDir, maxMb) {
  const saved = [];
  for (const a of attachments || []) {
    const url = a.optimizedPath || a.path;
    if (!url) continue;
    try {
      const res = await fetch(url, { headers: { "user-agent": UA_BOT } });
      if (!res.ok) continue;
      const size = Number(res.headers.get("content-length") || 0);
      if (size > maxMb * 1024 * 1024) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const name = url.split("/").pop().split("?")[0] || `media-${a.id || "x"}`;
      const file = path.join(outDir, name);
      await writeFile(file, buf);
      saved.push({ name, size: buf.length, from: url, title: a.title || null });
    } catch {
      /* média indisponible : on continue */
    }
  }
  return saved;
}

// ---------- main ----------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node scripts/scrape-soleva-org.mjs [options]
  --langs=en,fr       langues à crawler (défaut: en)
  --out=<dir>         dossier de sortie (défaut: content-export/soleva.org)
  --limit=N           ne crawler que N pages (test rapide)
  --concurrency=N     requêtes simultanées (défaut: 3)
  --check-links       vérifier les liens externes (cassés => 🔴 dans report.md)
  --media             télécharger les médias (images .webp/vidéos) dans <out>/media
  --max-media-mb=N    taille max d'un média (défaut: 25)
  --all               inclure les pages utilitaires (search, sitemap, auth, ...)
  --no-api            ne pas appeler l'API Megaphone (SEO/médias)
  --help`);
    return;
  }

  const start = Date.now();
  const outRoot = path.resolve(args.out);
  const apiPromise = args.noApi ? Promise.resolve(null) : fetchApiPages().catch((e) => {
    console.warn(`[warn] API Megaphone indisponible (${e.message}) — export sans SEO/médias`);
    return null;
  });

  (async () => {
    await mkdir(outRoot, { recursive: true });
    const apiBySlug = await apiPromise;

    // 1. liste des pages : sitemap si dispo, sinon liste de secours
    let pagePaths = new Map();
    try {
      const sm = await fetchText(`${ORIGIN}/sitemap.xml`, HEADERS_HTML);
      const locs = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      for (const loc of locs) {
        const rel = loc.replace(ORIGIN, "").replace(/\/+$/, "") || "/";
        for (const lang of args.langs) {
          const m = loc.match(new RegExp(`/${lang}(/.*)?$`));
          if (m) pagePaths.set(lang, [...(pagePaths.get(lang) || []), m[1] || "/"]);
        }
        if (!args.langs.some((l) => loc.includes(`/${l}/`) || loc.endsWith(`/${l}`))) {
          // URL racine sans langue : on l'attribue à chaque langue cible
          for (const lang of args.langs) if (loc === ORIGIN + "/" || rel === "/") pagePaths.set(lang, [...(pagePaths.get(lang) || []), "/"]);
        }
      }
      console.log(`[sitemap] ${locs.length} URLs trouvées`);
    } catch {
      console.warn("[warn] sitemap illisible — liste de secours utilisée");
    }
    for (const lang of args.langs) {
      const list = pagePaths.get(lang) || [];
      const fb = FALLBACK_PAGES[lang] || [];
      for (const p of fb) if (!list.includes(p)) list.push(p);
      if (!args.all) {
        pagePaths.set(lang, list.filter((p) => !UTILITY.has(p)));
      } else {
        pagePaths.set(lang, list);
      }
      pagePaths.set(lang, [...new Set(pagePaths.get(lang) || [])]);
    }

    // 2. crawl SSR + API par page
    const allLinksToCheck = [];
    const index = { generatedAt: new Date().toISOString(), source: ORIGIN, websiteId: WEBSITE_ID, langs: args.langs, pages: [] };
    let done = 0;
    const total = args.langs.reduce((n, l) => n + (pagePaths.get(l) || []).length, 0);

    for (const lang of args.langs) {
      const paths = (pagePaths.get(lang) || []).slice(0, args.limit || undefined);
      await mkdir(path.join(outRoot, lang), { recursive: true });
      for (let i = 0; i < paths.length; i += args.concurrency) {
        const chunk = paths.slice(i, i + args.concurrency);
        await Promise.all(
          chunk.map(async (p) => {
            const url = `${ORIGIN}/${lang}${p === "/" ? "/" : p}`;
            const entry = { lang, slug: slugOf(p), url };
            try {
              const html = await fetchText(url, HEADERS_HTML);
              const extracted = extract(html.text);
              Object.assign(entry, extracted);
              const meta = apiBySlug?.get(p) || null;
              if (meta) entry.cmsMeta = meta;
              if (args.checkLinks) {
                const candidates = (extracted.links.external || []).filter((u) => {
                  try { return !CHECK_SKIP_HOSTS.has(new URL(u).hostname.toLowerCase()); } catch { return false; }
                });
                allLinksToCheck.push(...candidates);
              }
              if (args.media && meta) {
                await mkdir(path.join(outRoot, "media"), { recursive: true });
                entry.downloadedMedia = await downloadMedia(meta.attachments, path.join(outRoot, "media"), args.maxMediaMb);
              }
              entry.ok = true;
            } catch (e) {
              entry.ok = false;
              entry.error = e.message;
            }
            done += 1;
            console.log(`[${done}/${total}] ${lang}${p} ${entry.ok ? "OK" : "ERR " + (entry.error || "")}`);
            const file = path.join(outRoot, lang, `${entry.slug}.json`);
            const { paragraphs, listItems, h1, h2, h3, images, links, title } = entry;
            await writeFile(
              file,
              JSON.stringify({ lang, slug: entry.slug, url, title, h1, h2, h3, paragraphs, listItems, links, images, cmsMeta: entry.cmsMeta || null, ok: entry.ok, error: entry.error || null }, null, 2),
            );
            index.pages.push({ lang, slug: entry.slug, url, ok: entry.ok, title: entry.title || "" });
          }),
        );
      }
    }

    // 3. vérification des liens
    let broken = [];
    if (args.checkLinks && allLinksToCheck.length) {
      console.log(`[links] vérification de ${allLinksToCheck.length} liens externes...`);
      const results = await checkAllLinks([...new Set(allLinksToCheck)], args.concurrency);
      broken = results.filter((r) => !r.ok);
      for (const r of results) {
        if (!r.ok) console.log(`  🔴 ${r.status || "ERR"} ${r.url}${r.error ? " (" + r.error + ")" : ""}`);
      }
    }

    // 4. rapport markdown
    const report = buildReport({ index, broken });
    await writeFile(path.join(outRoot, "report.md"), report);
    await writeFile(path.join(outRoot, "index.json"), JSON.stringify({ ...index, brokenLinks: broken }, null, 2));

    console.log(`\nTerminé en ${((Date.now() - start) / 1000).toFixed(1)}s — ${done} pages → ${outRoot}`);
    if (broken.length) console.log(`🔴 ${broken.length} lien(s) cassé(s) : voir report.md`);
  })().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}

function buildReport({ index, broken }) {
  const lines = [];
  lines.push(`# Export soleva.org — ${new Date(index.generatedAt).toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(`Source : ${index.source} (websiteId ${index.websiteId}) · ${index.pages.length} pages · langues : ${index.langs.join(", ")}`);
  lines.push("");
  lines.push("## Liens cassés (🔴)");
  if (!broken.length) lines.push("_Aucun lien cassé détecté._");
  for (const b of broken) lines.push(`- 🔴 \`${b.status || "ERR"}\` ${b.url}${b.error ? ` — ${b.error}` : ""}`);
  lines.push("");
  lines.push("## Pages");
  lines.push("");
  lines.push("| langue | page | URL | titre |");
  lines.push("|---|---|---|---|");
  for (const p of index.pages) {
    const ok = p.ok ? "" : " ⚠️";
    lines.push(`| ${p.lang} | ${p.slug} | ${p.url} | ${(p.title || "").slice(0, 80)}${ok} |`);
  }
  return lines.join("\n") + "\n";
}

main();
