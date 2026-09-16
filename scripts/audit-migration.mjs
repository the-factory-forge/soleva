// Run against a local server: vpr audit:migration [http://localhost:3100]
// Checks server-rendered pages; interactive checks and external links are separate.
import { writeFile } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const failures = [];
const pages = new Map();
const assets = new Set();
const external = new Set();
const links = [];
const decode = (s) =>
  s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]),
  );
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const get = (path) =>
  fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(60000) });
async function each(items, callback) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) await callback(queue.shift());
    }),
  );
}

const sitemap = await (await get("/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(decode(m[1])));
check(urls.length === 84, `Expected 84 sitemap pages, found ${urls.length}`);
const site = urls[0].origin;
await each(urls, async (url) => {
  const response = await get(url.pathname);
  check(response.status === 200, `${url.pathname}: HTTP ${response.status}`);
  const html = await response.text();
  pages.set(url.pathname, html);
  check([...html.matchAll(/<h1[\s>]/g)].length === 1, `${url.pathname}: expected one H1`);
  check(/<title>[^<]+<\/title>/.test(html), `${url.pathname}: missing title`);
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]));
  check(
    metas.some((m) => m.name === "description" && m.content),
    `${url.pathname}: missing description`,
  );
  const headLinks = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]));
  check(
    headLinks.some(
      (l) => l.rel === "canonical" && l.href.replace(/\/$/, "") === url.href.replace(/\/$/, ""),
    ),
    `${url.pathname}: wrong canonical`,
  );
  for (const lang of ["fr", "en", "de", "it"]) {
    check(
      headLinks.some((l) => l.rel === "alternate" && l.hreflang === lang),
      `${url.pathname}: missing ${lang} hreflang`,
    );
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${url.pathname}: invalid JSON-LD`);
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attrs(match[0]).href;
    if (!href || /^(mailto:|tel:)/.test(href)) continue;
    const target = new URL(href, url);
    if (target.origin === site || target.origin === base)
      links.push({ from: url.pathname, target });
    else external.add(target.href);
  }
  for (const match of html.matchAll(/<(?:img|source|video|link)\b[^>]*>/g)) {
    const a = attrs(match[0]);
    const candidates = [
      a.src,
      a.poster,
      ...(a.srcset?.split(",").map((p) => p.trim().split(/\s/)[0]) ?? []),
    ];
    if (["icon", "apple-touch-icon", "preload", "stylesheet"].includes(a.rel))
      candidates.push(a.href);
    for (const asset of candidates.filter(Boolean)) if (asset.startsWith("/")) assets.add(asset);
  }
});
console.log(`Checked ${pages.size} pages and their metadata.`);

const destinations = new Set(links.map(({ target }) => target.pathname));
await each(
  [...destinations].filter((path) => !pages.has(path)),
  async (path) => {
    const response = await get(path);
    check(
      response.status >= 200 && response.status < 400,
      `${path}: internal link HTTP ${response.status}`,
    );
    if (response.status === 200) pages.set(path, await response.text());
  },
);
for (const { from, target } of links) {
  if (target.hash && pages.has(target.pathname)) {
    const ids = [...pages.get(target.pathname).matchAll(/\bid="([^"]*)"/g)].map((m) =>
      decode(m[1]),
    );
    check(
      ids.includes(decodeURIComponent(target.hash.slice(1))),
      `${from}: missing anchor ${target.pathname}${target.hash}`,
    );
  }
}
await each(assets, async (asset) => {
  const response = await fetch(new URL(asset, base), {
    method: "HEAD",
    signal: AbortSignal.timeout(30000),
  });
  check(
    response.status === 200 && !response.headers.get("content-type")?.includes("text/html"),
    `${asset}: broken asset (${response.status})`,
  );
});

const legacy = {
  "about-soleva": "a-propos",
  agb: "confidentialite",
  "contact-us": "contact",
  "electric-conversion-van": "le-van/conversion-electrique",
  "environmental-impact": "impact",
  events: "evenements",
  journey: "voyage",
  news: "presse",
  partners: "partenaires",
  "solar-van": "le-van/systeme-solaire",
  team: "equipe",
  sitemap: "plan-du-site",
  search: "plan-du-site",
  auth: "login",
};
let redirects = 0;
await each(Object.entries(legacy), async ([oldPath, newPath]) => {
  for (const prefix of ["", "/fr", "/en", "/de", "/it"]) {
    const response = await get(`${prefix}/${oldPath}?ref=migration`);
    check(
      response.status === 301 &&
        response.headers.get("location") === `${prefix || "/fr"}/${newPath}?ref=migration`,
      `${prefix}/${oldPath}: wrong redirect (${response.status}, ${response.headers.get("location")})`,
    );
    redirects++;
  }
});
for (const path of [
  "/fr/does-not-exist",
  "/en/le-van/does-not-exist",
  "/es/team",
  "/does-not-exist",
]) {
  check((await get(path)).status === 404, `${path}: expected HTTP 404`);
}
for (const lang of ["fr", "en", "de", "it"]) {
  const response = await get(`/api/data.json?locale=${lang}`);
  const data = await response.json();
  check(
    data["@graph"].filter((node) => node["@type"] === "WebPage").length === 19,
    `${lang}: incomplete machine-readable pages`,
  );
}
const robots = await (await get("/robots.txt")).text();
check(
  robots.includes(`${site}/sitemap.xml`) && !robots.includes("Disallow: /api/\n"),
  "robots: sitemap or public data endpoint blocked",
);
check((await get("/llms.txt")).status === 200, "llms.txt: inaccessible");
await writeFile(
  "/tmp/soleva-rendered-external-links.json",
  JSON.stringify([...external].sort(), null, 2),
);
console.log(
  JSON.stringify(
    {
      sitemapPages: urls.length,
      internalLinks: links.length,
      uniqueInternalPaths: destinations.size,
      localAssets: assets.size,
      legacyRedirects: redirects,
      externalUrls: external.size,
      failures: [...new Set(failures)],
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
