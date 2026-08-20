# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## 📦 Installation

```bash
bun add -d @codefish/dev-configs@github:CodeFishStudio/dev-configs#v0.1.29
```

New projects are set up automatically via [CodeFish CLI](https://github.com/CodeFishStudio/codefish-cli).

## 📜 Package.json Scripts

When configs are installed, `addPackageJsonScripts()` adds CodeFish standard scripts to the
consuming project's `package.json`.

| Script         | Purpose                                                                | Auto-fix? |
| -------------- | ---------------------------------------------------------------------- | --------- |
| `lint`         | Lint the project and auto-fix issues where possible.                   | ✅        |
| `lint:check`   | Lint the project.                                                      | ❌        |
| `types`        | Type-check the project.                                                | N/A       |
| `format`       | Format all files with Prettier and write changes.                      | ✅        |
| `format:check` | Verify Prettier formatting without writing changes.                    | ❌        |
| `fix`          | Run all checks with auto-fixing (i.e. 'link', 'types', 'format')       | ✅        |
| `check`        | Run all checks for verification only. Primary script for CI pipelines. | ❌        |

**Local workflow:** run `fix` before committing to auto-correct lint and formatting issues.

**CI workflow:** run `check` to fail the build on lint, type, or formatting problems.

## 💪 Manual Setup

Refer to the [Manual Setup](./docs/MANUAL_SETUP.md) instructions.
