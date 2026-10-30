# Agent guidelines

This is a customer website. Read [README.md](README.md) for setup; use this
project's scripts and configuration. Preserve local rules and recorded departures
when consulting provider guidance.

## Template adaptations to preserve

- Soleva is light-only and uses Montserrat. Keep its semantic palette and public CSS font variables; do not import the template demo theme/font switchers or dark presets.
- Keep inline dictionary loader data: the out-of-stream approach was measured and reverted here.
- Preserve per-action Ads conversion labels, deferred consent loading, site-owned registry skips, and all four locales.
- Keep `prepare` (Vite+ hooks and Varlock codegen). Docker installs with `--ignore-scripts`, includes `.env.schema`, and builds with `pnpm_config_ignore_scripts=true`. The entrypoint adds local executables to PATH before running Varlock. Keep the Vite integration in `init-only` mode: `resolved-env` overrides runtime auth/DB values with build-time values.
- The September 2026 sync uses a fresh database baseline by explicit owner instruction. The owner resets local and VPS databases before applying it; never apply it over the previous schema. Subsequent releases preserve applied migrations.
- Record template reconciliation decisions and verified revisions in `.sync-template/report.html#history`.

## Current intranet configuration

The installed intranet follows the current template auth flow: `DATABASE_URL` and
`BETTER_AUTH_SECRET` are required. Public-only operation requires removing the
intranet through its documented boundary; empty credentials no longer disable it.
Authentication entry is in the localized footer, with no header login button.
Production uses Varlock `init-only` injection; retain dynamic mail/OAuth/storage
fields and site-owned modules. Never run deployment migrations as a test.

## Product and design context

Before product/UI work, read [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md) and
`.impeccable/config.json`. Keep the customer's identity, content, fonts, palette,
assets and routes; update these records only for intentional product/design changes.
The inherited Impeccable workflow is code-first. Keep the customer's chosen workflow.

## Shared Forge specifications

Resolve the actual `forge-specs` (sometimes named `forge-spec`), `forge-template`,
`forge-registry` and `forge-skills` checkouts from the workspace or Git remotes.
Use the canonical links when a checkout is unavailable; report inaccessible context.
Read [the shared entrypoint](https://github.com/the-factory-forge/forge-specs/blob/main/AGENTS.md) and its task-specific contracts before implementation.
Template stack, application and website-creation specs belong to
[forge-template](https://github.com/the-factory-forge/forge-template/blob/main/openspec/specs/); plugin behavior belongs to
[forge-registry](https://github.com/the-factory-forge/forge-registry/blob/main/openspec/specs/). Only contracts constraining both
providers belong to `forge-specs`. Keep customer specs and decisions in the site.
References provide context; they do not authorize unrelated changes or deployments.

## Shared color contract

For UI/CSS/Tailwind changes, read [Shared UI](https://github.com/the-factory-forge/forge-specs/blob/main/openspec/specs/shared-ui/spec.md).
Preserve the site's palette, typography and theme choices; shared token names stay stable.

## Essentials

Before application edits, read the application conventions linked below. Use
`vpr` (`vp run`) for project scripts. Keep local secret-bearing env files unread;
use the project's schema and sanitized validation. Preserve existing data and migrations.

## Task guides

Read the applicable sections before editing. Resolve provider links to local
checkouts when available; keep site-specific integration and design choices local.

| Task                                                    | Read                                                                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development server, local origins or runtime test ports | [Local runtime](docs/agent-reference.md#local-runtime)                                                                                              |
| Application code, environment or local servers          | [Application conventions](docs/agent-reference.md#application-conventions)                                                                          |
| Video, dictionaries, fonts or lazy navigation           | [Measured site behavior](docs/agent-reference.md#measured-site-behavior)                                                                            |
| Database configuration, hosting or migrations           | [Database](docs/agent-reference.md#database)                                                                                                        |
| Queries, loaders, cache updates or mutations            | [Query layout](docs/agent-reference.md#query-layout)                                                                                                |
| Auth routes, redirects or login navigation              | [Localized auth](docs/agent-reference.md#localized-auth)                                                                                            |
| Public copy, UI messages, translations or metadata      | [Copywriting](.agents/copywriting.md)                                                                                                               |
| Routing, server boundaries, queries or mutations        | [Data flow](.agents/data-flow.md)                                                                                                                   |
| Authentication, middleware or route guards              | [Auth](.agents/auth.md)                                                                                                                             |
| Server logs or request errors                           | [Observability](.agents/observability.md)                                                                                                           |
| Schema definitions or migrations                        | [Database conventions](.agents/database.md)                                                                                                         |
| TypeScript changes                                      | [TypeScript](.agents/typescript.md)                                                                                                                 |
| Commands and validation                                 | [Workflow](.agents/workflow.md)                                                                                                                     |
| Test selection or test changes                          | [Testing](.agents/testing.md)                                                                                                                       |
| Filters, search, sorting, pagination or calendar state  | [ADR-0008](https://github.com/the-factory-forge/forge-specs/blob/main/concepts/adr/0008-url-owned-filters-and-view-state.md)                        |
| Vite+ commands, versions, setup or validation           | [Tooling](https://github.com/the-factory-forge/forge-template/blob/main/docs/agent-reference.md#tooling), local `package.json` and `vite.config.ts` |

## Maintenance

- Template updates: [sync-template](https://github.com/the-factory-forge/forge-skills/blob/main/skills/sync-template/SKILL.md), using
  [local tracking](.sync-template/config.json) and [history](.sync-template/report.html#history).
  Preserve recorded departures, content, branding, configuration and migration history.
- Registry adoption: [sync-from-forge-registry](https://github.com/the-factory-forge/forge-registry/blob/main/.agents/skills/sync-from-forge-registry/SKILL.md).
  Promote requested upstream improvements with [sync-to-forge-registry](https://github.com/the-factory-forge/forge-registry/blob/main/.agents/skills/sync-to-forge-registry/SKILL.md).
- Dependencies: [update-dependencies](https://github.com/the-factory-forge/forge-skills/blob/main/skills/update-dependencies/SKILL.md).
  Keep procedures with their provider; use the actual checkout or installed plugin.

<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `vpx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `vpx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->
