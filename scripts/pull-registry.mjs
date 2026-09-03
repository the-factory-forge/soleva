import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

// ---------------------------------------------------------------------------
// Per-site config — adjust paths/prefix to match this repository layout.
// ---------------------------------------------------------------------------
const config = {
  // Prefix for registry targets (e.g. "src/" if components live under src/).
  prefix: "src/",
  // Map registry item -> actual file path on this site (for divergent layouts).
  overrides: {},
  // Items to skip (dictionaries, template-only providers, and site-customized
  // files that the pull would otherwise clobber - see AGENTS.md clobber protocol).
  skip: new Set([
    "i18n-engine",
    "theme-presets",
    "theme-provider",
    "theme-switcher",
    "font-presets",
    "font-provider",
    "font-switcher",
    // Site-customized (restored after pull - detected via the CUSTOM grep).
    "navbar",
    "footer-helpers",
    "build-metadata",
    // ui-shims is ALWAYS site-owned (framework re-exports).
    "ui-shims",
  ]),
};

const REGISTRY_BRANCH = "main";
const args = process.argv.slice(2);
const customUrl = args.find((a) => a.startsWith("http"));
const REGISTRY_URL =
  customUrl ||
  `https://raw.githubusercontent.com/the-factory-forge/forge-registry/${REGISTRY_BRANCH}/public/registry/registry.json`;

const root = process.cwd();
const DRY_RUN = args.includes("--dry-run");

// Items to pull — none = all (except skip list).
const selected = args.filter((a) => !a.startsWith("--") && !a.startsWith("http"));

function resolveTarget(file) {
  const base = file.target || file.path;
  const withoutSrc = base.replace(/^src\//, "");
  return config.prefix + withoutSrc;
}

async function main() {
  console.log(`Fetching registry from ${REGISTRY_URL}\n`);

  let registry;
  if (REGISTRY_URL.startsWith("http")) {
    const res = await fetch(REGISTRY_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    registry = await res.json();
  } else {
    registry = JSON.parse(readFileSync(REGISTRY_URL, "utf8"));
  }

  let installed = 0;
  let skipped = 0;
  let notFound = 0;

  for (const item of registry.items) {
    if (config.skip.has(item.name)) {
      console.log(`  skip  ${item.name}`);
      skipped++;
      continue;
    }
    if (selected.length > 0 && !selected.includes(item.name)) {
      console.log(`  skip  ${item.name} (not selected)`);
      skipped++;
      continue;
    }

    for (const file of item.files) {
      if (!file.content) {
        console.warn(`  warn  ${item.name}: ${file.path} has no embedded content`);
        continue;
      }
      const target = config.overrides[item.name] ?? resolveTarget(file);
      const fullPath = join(root, target);
      if (DRY_RUN) {
        console.log(`  would write ${item.name} -> ${target}`);
        installed++;
        continue;
      }
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, file.content);
      installed++;
    }
    console.log(`  pull  ${item.name}`);
  }

  console.log(
    `\nDone: ${installed} files ${DRY_RUN ? "would be written" : "installed"}, ${skipped} items skipped, ${notFound} not found`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
