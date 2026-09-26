import { auditRedactPreset, type RedactConfig } from "evlog";
import evlog from "evlog/nitro/v3";
import { defineConfig } from "nitro";

const redact = {
  ...auditRedactPreset,
  paths: [...(auditRedactPreset.paths ?? []), "cookies"],
} satisfies RedactConfig;

export default defineConfig({
  // Runtime compression lives in server/plugins/compression.ts (nitro picks
  // up the directory via serverDir).
  serverDir: "server",
  // Pre-compress .output/public assets (gzip+brotli) at build time.
  compressPublicAssets: true,
  // Static images are immutable-ish (hash-less names, but rarely change):
  // 7-day browser cache avoids re-downloads across pages/sessions.
  routeRules: {
    "/images/**": {
      headers: {
        "cache-control": "public, max-age=604800",
        "access-control-allow-origin": "*",
      },
    },
    "/assets/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "access-control-allow-origin": "*",
      },
    },
    "/fonts/**": { headers: { "access-control-allow-origin": "*" } },
  },
  experimental: { asyncContext: true },
  modules: [evlog({ env: { service: "web" }, redact })],
});
