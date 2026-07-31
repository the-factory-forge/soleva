import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"

// ---------------------------------------------------------------------------
// Per-site config — adjust paths/prefix to match this repository layout.
// ---------------------------------------------------------------------------
const config = {
  // Prefix for registry targets (e.g. "src/" if components live under src/).
  prefix: "",
  // Map registry item -> actual file path on this site (for divergent layouts).
  overrides: {
    "cookie-banner": "components/layout/cookie-banner.tsx",
    "consent-init": "components/layout/consent-init.tsx",
  },
  // Items to skip (dictionaries and template-only providers).
  skip: new Set([
    "i18n-engine",
    "theme-presets",
    "theme-provider",
    "theme-switcher",
    "font-presets",
    "font-provider",
    "font-switcher",
  ]),
}

const REGISTRY_BRANCH = "main"
const args = process.argv.slice(2)
const customUrl = args.find((a) => a.startsWith("http"))
const REGISTRY_URL =
  customUrl ||
  `https://raw.githubusercontent.com/the-corner-inc/react-factories/${REGISTRY_BRANCH}/public/registry/registry.json`

const root = process.cwd()
const DRY_RUN = args.includes("--dry-run")

// Items to pull — required as arguments (e.g. `node pull-registry-select.mjs footer cookie-banner`).
const selected = args.filter((a) => !a.startsWith("--") && !a.startsWith("http"))

function resolveTarget(file) {
  const base = file.target || file.path
  const withoutSrc = base.replace(/^src\//, "")
  return config.prefix + withoutSrc
}

async function main() {
  if (selected.length === 0) {
    console.error("Usage: node scripts/pull-registry-select.mjs <item> [item...]")
    console.error("Example: node scripts/pull-registry-select.mjs footer cookie-banner")
    process.exit(1)
  }

  console.log(`Fetching registry from ${REGISTRY_URL}\n`)

  let registry
  if (REGISTRY_URL.startsWith("http")) {
    const res = await fetch(REGISTRY_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    registry = await res.json()
  } else {
    registry = JSON.parse(readFileSync(REGISTRY_URL, "utf8"))
  }

  const available = new Set(registry.items.map((i) => i.name))
  const missing = selected.filter((s) => !available.has(s))
  if (missing.length > 0) {
    console.error(`Items not found in registry: ${missing.join(", ")}`)
    console.error(`Available: ${[...available].sort().join(", ")}`)
    process.exit(1)
  }

  let installed = 0

  for (const item of registry.items) {
    if (!selected.includes(item.name)) continue
    if (config.skip.has(item.name)) {
      console.log(`  skip  ${item.name}`)
      continue
    }

    for (const file of item.files) {
      if (!file.content) {
        console.warn(`  warn  ${item.name}: ${file.path} has no embedded content`)
        continue
      }
      const target = config.overrides[item.name] ?? resolveTarget(file)
      const fullPath = join(root, target)
      if (DRY_RUN) {
        console.log(`  would write ${item.name} -> ${target}`)
        installed++
        continue
      }
      mkdirSync(dirname(fullPath), { recursive: true })
      writeFileSync(fullPath, file.content)
      installed++
    }
    console.log(`  pull  ${item.name}`)
  }

  console.log(
    `\nDone: ${installed} files ${DRY_RUN ? "would be written" : "installed"}`,
  )
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
