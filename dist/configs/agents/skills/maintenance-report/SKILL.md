---
name: maintenance-report
description: Generates client-facing maintenance reports by comparing the current work against a base branch (e.g. develop). Produces a markdown report covering config changes, bug fixes, code modernisation, and package version updates. Use when the user asks for a maintenance report, release notes for a maintenance round, or a summary of what changed compared to develop/main.
---

# Maintenance Report

Generate a client-facing maintenance report comparing current work against a base branch.

## Workflow

1. **Identify the base branch** — default to `develop`; use `main` if the user specifies or the repo has no `develop`.
2. **Gather data** — run these in parallel from the project root:

```bash
git log <base>..HEAD --oneline
git diff <base>...HEAD --stat
git show <base>:package.json  # compare dependencies only
cat package.json              # current dependencies
git diff <base>...HEAD -- package.json app.config.ts .env.example
```

3. **Analyse commits and diffs** — read changed files as needed to understand functional changes. Group related work into report sections.
4. **Write the report** — follow the template and rules below.
5. **Output** — write to `MAINTENANCE_REPORT.md` in the project root unless the user specifies another path.

## Rules

### Include

- Executive summary (1–2 sentences on the headline changes)
- Build & platform configuration changes
- Environment variable migrations
- Bug fixes and UX improvements (grouped by feature/area)
- Code modernisation (refactors, API migrations, pattern updates)
- **Package Updates** — single table, **last section in the report**

### Exclude

- Dev dependencies (only compare `dependencies` in `package.json`)
- Unchanged packages (only list packages whose version changed)
- Branch names anywhere in the report
- Developer tooling (`.cursor/`, `.vscode/`, IDE rules, lint config)
- Patch packages (`patches/`, `patchedDependencies`)
- Recommended testing / QA checklists (unless the user explicitly asks)
- Commit hashes, file counts, or internal git metadata (unless the user asks)

### Package table rules

- One table with columns: `Package | Before | After`
- Sort alphabetically by package name
- Use `—` for packages that are newly added (no prior version)
- Only include production `dependencies`, never `devDependencies`

## Report template

Section order is fixed. **Package Updates must be the last section.** Omit any section that has no meaningful changes.

```markdown
# Maintenance Report

**Project:** [Project name]

---

## Executive Summary

[1–2 sentences. Lead with the most significant change — e.g. SDK upgrade, major dependency bump, or primary bug-fix theme.]

---

## Build & Platform Configuration

- **[Change title]** — [Plain-language description of what changed and why.]

---

## Environment Variables

[Include only when env vars changed. Use a before/after table.]

| Before    | After     |
| --------- | --------- |
| `OLD_VAR` | `NEW_VAR` |

[Note any action required by the client, e.g. updating CI secrets or `.env` files.]

---

## Bug Fixes & UX Improvements

### [Feature or area name]

- [What was fixed or improved, in client-friendly language.]

---

## Code Modernisation

### [Change title]

[What was refactored or migrated and which parts of the app are affected.]

---

## Package Updates

| Package        | Before      | After       |
| -------------- | ----------- | ----------- |
| `package-name` | old-version | new-version |
```

## Writing guidelines

- **Audience:** client stakeholders, not developers. Plain language; avoid internal jargon.
- **Tone:** factual and concise. Describe outcomes, not implementation details.
- **Bullet points:** start with the user-visible effect, not the technical mechanism.
- **Section headings:** use feature/area names for bug fixes (e.g. "Species Profile Screen"), not file paths.
- **Omit empty sections** — if a category has no changes, leave it out entirely rather than writing "No changes."

## Extracting package diffs

Compare only `dependencies` between base and current:

```bash
git show <base>:package.json | python3 -c "
import json, sys
d = json.load(sys.stdin)
for k, v in sorted(d.get('dependencies', {}).items()):
    print(f'{k}: {v}')
"

python3 -c "
import json
d = json.load(open('package.json'))
for k, v in sorted(d.get('dependencies', {}).items()):
    print(f'{k}: {v}')
"
```

Include a row in the table only when the version string differs between base and current.

## Categorising changes

Use commit messages and file paths as hints:

| Signal                                                                   | Section                        |
| ------------------------------------------------------------------------ | ------------------------------ |
| `app.config.ts`, build plugins, native config                            | Build & Platform Configuration |
| `.env.example`, env var renames                                          | Environment Variables          |
| `fix:`, screen/component changes with user-visible effect                | Bug Fixes & UX Improvements    |
| `refactor`, API migrations, pattern updates (`forwardRef`, hook renames) | Code Modernisation             |
| `package.json` dependency version changes                                | Package Updates                |

When a change spans categories (e.g. an SDK upgrade causes both config and code changes), describe the config impact in **Build & Platform Configuration** and the code impact in **Code Modernisation**. List the version bump only in **Package Updates**.
