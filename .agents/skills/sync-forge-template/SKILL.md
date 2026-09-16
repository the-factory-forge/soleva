---
name: sync-forge-template
description: Update an existing website generated from the-factory-forge/forge-template to the latest verified template revision while preserving client content, design, integrations, and deployment settings. Use for template syncs and upstream template updates, including repositories with unrelated Git histories. Not for creating a website or updating forge-template from its own starter upstream.
---

# Sync a Forge website with its template

Bring the site's foundation up to a verified template revision, preserve its client-specific behavior, and leave a reviewable change with validation results and a record for the next sync.

The source is **https://github.com/the-factory-forge/forge-template**. The template's own `upstream` instructions concern `mugnavo/tanstarter`; do not apply that upstream or assume its shared-history setup exists in a client repository.

## Establish the working state

- Locate the client checkout and confirm its origin and template provenance. Read its `AGENTS.md`, relevant `.agents/` guidance, README, package scripts, lockfile, environment schema, and any previous sync record. Follow its task-specific skill-loading instructions.
- Record the client's starting commit (`SITE_START`), branch, staged/unstaged changes, and untracked files. Use a dedicated `agent/sync-forge-template` branch, with a unique suffix if needed. Honor an explicitly requested branch.
- Keep unrelated user work intact. With a dirty checkout, prefer an isolated worktree from the relevant committed state and report which local changes it excludes. If the update depends on those changes, reconcile that dependency before proceeding. Do not silently stash, commit, discard, or copy secret-bearing files to make the tree clean. A worktree does not include uncommitted changes.
- Establish the existing site's important behavior: content and contact actions, routes and locales, branding, enabled features, canonical domain, and deployment configuration. Record baseline check failures separately from regressions introduced by the sync.

## Resolve the target and comparison base

**Target (`TARGET`):** discover the canonical template repository's current default branch, fetch it, and record its immutable commit SHA. An explicit user-requested release or commit takes precedence. A local `forge-template` checkout helps inspection but may be stale or dirty; inspect the fetched commit rather than treating its working tree as the latest release.

Use `git ls-remote --symref https://github.com/the-factory-forge/forge-template.git HEAD` to discover the branch. Fetch that verified branch into the client object database or a separate inspection clone. Resolve `FETCH_HEAD` immediately if using it; another fetch replaces it. Do not repoint the site's `origin` or an existing `upstream` remote. Reuse a named template remote only after verifying its URL.

If the remote cannot be checked, describe the last locally available revision as such. Continue useful inspection, but do not claim it is the latest template.

**Base (`BASE`):** find the template revision used to generate the site or the last reconciled template revision. Look in an existing sync record, original build notes, commits, and pull requests. A real merge base is useful when history is shared, but previous selective syncs may have advanced the recorded comparison base beyond it.

- A generated repository normally starts with its own initial commit, unlike a fork. Missing shared history is expected; see [GitHub's template documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
- Check for shallow or missing history before concluding that no merge base exists; deepen/fetch the relevant history when necessary.
- Confirm that `BASE` and `TARGET` belong to the canonical template history. Check the relationship with `git merge-base --is-ancestor`. Inspect rewritten history or an intentional downgrade explicitly instead of treating it as a routine forward update.
- A matching generation snapshot can establish a base. A similar timestamp, dependency version, or repository name cannot establish one by itself.
- If no reliable base exists, compare the client's initial snapshot and current files with the target, then reconcile relevant changes manually by concern. Document the uncertainty; do not synthesize ancestry, choose an arbitrary old commit, or overwrite the site to manufacture a base.

For a known base, review `git diff --stat "$BASE" "$TARGET"`, `git diff --name-status -M "$BASE" "$TARGET"`, and the relevant commits. Review renames and deletions as well as additions. Include still-applicable omissions recorded by previous syncs.

## Classify and integrate the changes

Use file contents and local history to determine ownership. Directory names alone do not make a file safe to replace.

| Concern                                                                                          | Treatment                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client data, copy, prices, contacts, navigation, legal content, images, icons, and logos         | Preserve the site's values and assets; adapt their schema only where required by a template change. Typical locations: `src/lib/site/`, dictionaries, public assets, and client routes. |
| Theme, typography, layouts, sections, navbar/footer, and framework adapters                      | Preserve local appearance and behavior while applying relevant fixes. Inspect `src/styles.css`, other stylesheet imports, fonts, and customized components.                             |
| Shared router/server infrastructure, SEO helpers, i18n engine, auth guards, and consent handling | Merge template fixes with site adaptations. A protected data directory can still contain shared code that needs updating.                                                               |
| Dependencies, scripts, workspace policy, config, CI, Docker, and startup scripts                 | Integrate the compatible target changes together; preserve site-specific scripts, build arguments, services, and deployment identities. Review lifecycle hooks before installing.       |
| Schema and migrations                                                                            | Preserve client tables and migration history. Reconcile numbering/snapshots; do not overwrite applied migrations or infer permission to migrate a live database.                        |
| Instructions and project records                                                                 | Merge useful template guidance without replacing client-specific instructions, project history, or the sync record with template examples.                                              |

Choose the strategy from the actual history:

### Shared history

On the isolated sync branch, a normal merge may be appropriate. Use `git merge --no-ff --no-commit "$TARGET"` to keep the result reviewable before committing; `--no-commit` alone does not stop a fast-forward. See [Git's merge documentation](https://git-scm.com/docs/git-merge).

Resolve conflicts by the ownership table. Audit **all** changed files, including cleanly merged changes, against `SITE_START`; automatic merge success does not prove client behavior survived. Reconcile previous omitted changes even if Git considers their commits merged.

### Unrelated history or an existing selective-sync process

Apply the **template delta from `BASE` to `TARGET`**, not a replacement of the client tree. For a reviewed set of paths, a `git diff --binary --full-index BASE TARGET -- paths...` patch can support `git apply --3way` when the required base blobs are present in the client object database and the index/worktree are clean. Use real, verified refs and an explicitly reviewed path list. Handle conflicts, renames, and deletions deliberately; semantic adaptations may be clearer as manual edits.

Continue the site's established selective-sync approach when that makes the change easier to assess. If the base is unknown, perform the manual comparison described above. Do not use a blanket copy, `rsync --delete`, hard reset to the template, automatic “ours/theirs” resolution, or `--allow-unrelated-histories` as a shortcut. Do not create an ancestry-only merge that falsely marks unapplied template work as integrated.

## Preserve Forge-specific adaptations

- **Site identity:** retain the actual domain, the `VITE_BASE_URL`/`SITE_URL` connection, and the separate canonical-host middleware. Never introduce the template hostname, sample contact data, demo controls, or unwanted routes into the client site. Keep sitemap, robots, llms/data endpoints, and structured data aligned with real routes and content.
- **Languages and design:** preserve the site's configured locales and translations, font families, semantic colors, dark-mode behavior, and logo/favicon. Apply shared engine or CSS fixes without replacing translated copy or reintroducing demo theme presets as public defaults.
- **Optional features:** preserve the site's auth, database, analytics, and marketing choices. Retain showcase mode when these are disabled; new template capability is not a reason to activate it. Preserve consent behavior and client conversion destinations.
- **Environment:** inspect `.env.schema` and sanitized examples, not local secret-bearing env files or production values. Preserve Varlock validation/code generation and application `ENV` imports. Record new required variable names and setup needs without inventing credentials.
- **Dependencies and generated files:** reconcile manifests and site-only dependencies first, then use the repository's pinned toolchain to update and verify its lockfile. Regenerate route trees and environment types through the repository's commands. Do not replace the lockfile wholesale, hand-edit generated files, or run a general dependency upgrade unrelated to the target delta.
- **Deployment:** preserve the site's infrastructure wiring and the target's required prepare/codegen/startup behavior. Inspect entrypoints before running containers: startup can apply database migrations. Use only a disposable local test database for validation that needs one.

## Validate and record the result

Inspect the destination's current commands rather than freezing tool versions into this skill. The inspected Forge template uses `vpr` as shorthand for `vp run`:

- Run baseline lint/type checks (`vpr lint` currently includes both) and the narrowest relevant tests. If a covered browser journey changes, run its E2E tests; `vpr test:e2e` owns the production build/server lifecycle, so avoid a duplicate build.
- Validate environment configuration with `vp exec varlock load --agent`. Handle missing local setup explicitly; never copy production credentials to make a check pass.
- For runtime inspection use port **3100**, leaving 3000 available. Inspect affected pages on mobile and desktop in the configured locales. Check relevant contact/booking actions, redirects, metadata, theme behavior, consent, and optional-feature states against the baseline. Avoid submitting real enquiries or sending production analytics during testing.
- Review the complete diff from `SITE_START` and run `git diff --check`. Check preserved content/assets, unresolved conflicts, accidental template/demo values, generated output, and lockfile consistency. Separate passed checks, failed checks, and checks blocked by the environment.

Update the existing sync record, or create `docs/template-sync.md` if none exists. Record the canonical source, fetched branch, target SHA, date, client starting commit, comparison base and its evidence, strategy, applied changes, intentional deviations, unresolved/omitted changes, registry revision if used, and validation results. Keep prior entries so later agents can revisit omissions.

A recorded comparison target is not proof of a completed sync. Mark an incomplete update as **partial**, retain its outstanding work, and do not advance a “fully synchronized” marker past unresolved changes. When a completed reconciliation becomes the next comparison base, carry forward intentional deviations and omissions that still need consideration.

Deliver the reviewable diff with a concise account of what changed, what site behavior was preserved, the exact template target, validation, and remaining work. Respect any existing authorization for commits, pushes, PRs, or deployment; a local template-sync request by itself does not authorize publishing, production migrations, or deployment. Continue independent safe work when a specific change requires missing information or approval.
