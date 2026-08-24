import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

import { version } from "./package.json";

// https://viteplus.dev/config/
export default defineConfig({
  // Git hooks for staged files - https://viteplus.dev/guide/commit-hooks
  staged: {
    "*": "vp fmt --no-error-on-unmatched-pattern",
  },

  // Oxfmt - https://oxc.rs/docs/guide/usage/formatter/config.html
  fmt: {
    tabWidth: 2,
    semi: true,
    printWidth: 100,
    singleQuote: false,
    endOfLine: "lf",
    trailingComma: "all",
    sortImports: {},
    sortTailwindcss: {
      stylesheet: "./src/styles.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortPackageJson: true,
    ignorePatterns: [
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "bun.lock",
      "routeTree.gen.ts",
      ".tanstack-start/",
      ".tanstack/",
      "drizzle/",
      "migrations/",
      ".drizzle/",
      ".cache",
      "worker-configuration.d.ts",
      ".vercel",
      ".output",
      ".wrangler",
      ".netlify",
      "dist",
    ],
  },

  // Oxlint - https://oxc.rs/docs/guide/usage/linter/config
  lint: {
    plugins: ["typescript", "react", "react-perf", "jsx-a11y"],
    env: {
      builtin: true,
      node: true,
      browser: true,
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      // Plugins with "/" in name have to be aliased for now
      // Issue: https://github.com/oxc-project/oxc/issues/14557
      {
        name: "eslint-tanstack-router",
        specifier: "@tanstack/eslint-plugin-router",
      },
      {
        name: "eslint-tanstack-query",
        specifier: "@tanstack/eslint-plugin-query",
      },
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "warn",

      "no-deprecated": "warn",
      "typescript/no-floating-promises": "off",
      "typescript/no-misused-spread": "off",

      "jsx-a11y/prefer-tag-over-role": "off",

      // Experimental:
      // https://oxc.rs/docs/guide/usage/linter/rules/react/react-compiler.html
      "react/react-compiler": "warn",

      "eslint-tanstack-router/create-route-property-order": "warn",

      "eslint-tanstack-query/exhaustive-deps": "warn",
      "eslint-tanstack-query/stable-query-client": "warn",
      "eslint-tanstack-query/no-rest-destructuring": "warn",
      "eslint-tanstack-query/no-unstable-deps": "warn",
      "eslint-tanstack-query/infinite-query-property-order": "warn",
      "eslint-tanstack-query/no-void-query-fn": "warn",
      "eslint-tanstack-query/mutation-property-order": "warn",
    },
    ignorePatterns: [
      "dist",
      ".wrangler",
      ".vercel",
      ".netlify",
      ".output",
      "build/",
      "worker-configuration.d.ts",
      "scripts/",
    ],
  },

  // Vite config - https://vite.dev/config/
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  // Pre-bundle the heavy dependencies so the on-demand transform (client and
  // SSR dev) doesn't have to compile them one by one on first request.
  optimizeDeps: {
    include: ["motion", "lucide-react", "@base-ui/react", "leaflet"],
  },
  environments: {
    ssr: {
      optimizeDeps: {
        include: [
          "motion",
          "lucide-react",
          "@base-ui/react",
          "leaflet",
          "better-auth",
          "drizzle-orm",
          "postgres",
          "zod",
          "@better-auth/drizzle-adapter",
          "@t3-oss/env-core",
        ],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    // Dev server warmup: pre-transform the site's own modules at startup so
    // pages render instantly on first visit (on-demand transform is slow in
    // this stack - see TanStack Start dev-server docs).
    warmup: {
      clientFiles: [
        "./src/routes/__root.tsx",
        "./src/routes/_site.tsx",
        "./src/routes/_site/$lang.tsx",
      ],
      ssrFiles: [
        "./src/routes/__root.tsx",
        "./src/routes/_site.tsx",
        "./src/routes/_site/$lang.tsx",
        "./src/routes/_site/$lang/index.tsx",
        "./src/routes/_site/$lang/a-propos.tsx",
        "./src/routes/_site/$lang/le-van/index.tsx",
        "./src/routes/_site/$lang/le-van/$slug.tsx",
        "./src/routes/_site/$lang/habitat.tsx",
        "./src/routes/_site/$lang/impact.tsx",
        "./src/routes/_site/$lang/voyage.tsx",
        "./src/routes/_site/$lang/soutenir.tsx",
        "./src/routes/_site/$lang/contact.tsx",
        "./src/routes/_site/$lang/faq.tsx",
        "./src/routes/_site/$lang/mentions-legales.tsx",
        "./src/routes/_site/$lang/confidentialite.tsx",
      ],
    },
  },
  plugins: lazyPlugins(() => [
    devtools({
      // https://tanstack.com/devtools/latest/docs/vite-plugin#console-piping
      consolePiping: { enabled: false },
      // injectSource walks the AST of every transformed module to build
      // sourcemaps (client + SSR) - a constant per-module cost in dev.
      // Disabled: devtools still work, transforms are faster.
      injectSource: { enabled: false },
    }),
    tanstackStart(),
    // https://tanstack.com/start/latest/docs/framework/react/guide/hosting
    nitro({
      // Runtime compression lives in server/plugins/compression.ts (nitro picks
      // up the directory via serverDir).
      serverDir: "server",
      // Pre-compress .output/public assets (gzip+brotli) at build time.
      compressPublicAssets: true,
      // Static images are immutable-ish (hash-less names, but rarely change):
      // 7-day browser cache avoids re-downloads across pages/sessions.
      routeRules: {
        "/images/**": {
          headers: { "cache-control": "public, max-age=604800" },
        },
      },
    }),
    // React plugin (Babel) is required by TanStack Start's React Refresh
    // runtime in dev. React Compiler is build-only (below) so dev transforms
    // stay as fast as the stack allows.
    viteReact(),
    // React Compiler is a build-time optimization - applying it in dev slows
    // down every module transform (babel). Build-only keeps dev fast.
    // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#react-compiler
    {
      ...babel({
        presets: [reactCompilerPreset()],
      }),
      apply: "build",
    },
    tailwindcss(),
  ]),
});
