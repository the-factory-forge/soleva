// Generates responsive srcset variants (480/800/1200) for site images.
// Quality convention: 480px variants = q90, larger variants = q80
// (--quality=NN overrides for all widths).
// Variants are capped at the source width (no upscaling, no duplicates).
// Sources: .webp AND .png (sharp converts PNG -> webp for the variants; the
// original stays untouched - backup convention).
//
// Usage:
//   node scripts/generate-image-variants.mjs public/images/hero.webp
//   node scripts/generate-image-variants.mjs public/images            (all webp+png in dir)
//   node scripts/generate-image-variants.mjs public/images/hero.webp --widths 480,800,1200
//   node scripts/generate-image-variants.mjs public/images --quality=90
//
// Existing variant files (name-\d{3,4}.webp) are skipped.
import { readdir, stat } from "node:fs/promises";
import { join, basename, dirname, extname } from "node:path";

import sharp from "sharp";

const VARIANT_RE = /-\d{3,4}\.webp$/;
const SOURCE_RE = /\.(webp|png)$/i;

function parseWidths(args) {
  const flag = args.find((a) => a.startsWith("--widths="));
  return flag
    ? flag.slice("--widths=".length).split(",").map(Number).filter(Boolean)
    : [480, 800, 1200];
}

function parseQuality(args) {
  const flag = args.find((a) => a.startsWith("--quality="));
  return flag ? Number(flag.slice("--quality=".length)) || 0 : 0; // 0 = per-width convention
}

// 480 -> q90, anything larger -> q80 (unless --quality= overrides).
function qualityFor(width, explicitQuality) {
  if (explicitQuality > 0) return explicitQuality;
  return width <= 480 ? 90 : 80;
}

async function processFile(file, widths, explicitQuality) {
  const meta = await sharp(file).metadata();
  const sourceWidth = meta.width ?? 0;
  const dir = dirname(file);
  const base = basename(file, extname(file));
  let count = 0;
  for (const w of widths) {
    if (w >= sourceWidth) continue;
    const quality = qualityFor(w, explicitQuality);
    const out = join(dir, `${base}-${w}.webp`);
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality }).toFile(out);
    console.log(`  ${basename(out)} (${w}px, q${quality})`);
    count++;
  }
  if (count === 0) console.log(`  (no variants: source ${sourceWidth}px) ${basename(file)}`);
}

const args = process.argv.slice(2);
const widths = parseWidths(args);
const quality = parseQuality(args);
const targets = [];

for (const a of args) {
  if (a.startsWith("--")) continue;
  const st = await stat(a).catch(() => null);
  if (st?.isDirectory()) {
    for (const f of await readdir(a)) {
      if (SOURCE_RE.test(f) && !VARIANT_RE.test(f)) targets.push(join(a, f));
    }
  } else if (st?.isFile()) {
    targets.push(a);
  }
}

for (const t of targets) {
  if (VARIANT_RE.test(t)) continue;
  console.log(`→ ${t}`);
  await processFile(t, widths, quality);
}
console.log("Done.");
