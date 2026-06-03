# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## 📦 Installation

```bash
bun add -d @codefish/dev-configs@github:CodeFishStudio/dev-configs#v0.1.0
```

## ⚡ Setup Tool

Run the setup tool to automatically set up your project's dev configs:

```bash
bun cfs-setup
```

This script will provide options to:

- Setup Prettier
- Setup ESLint
- Setup TypeScript
- Setup Cursor rules/settings

Also installs relevant dependencies, adds package.json scripts and adds .gitignore patterns.

## 💪 Manual Setup

Refer to the [Manual Setup](./docs/MANUAL_SETUP.md) instructions.

## 🛠 Local Development

### Testing `cfs-setup` locally

From this repo, run the interactive setup wizard against a throwaway project in `.sandbox/`:

```bash
bun run test:setup
```

The script creates `.sandbox/` if needed, scaffolds a minimal `package.json`
when the sandbox is new, builds `dist/` when the compiled setup entry is
missing, then runs `cfs-setup` with that directory as the working directory.
Re-running reuses the existing sandbox so you can test skip behavior and
incremental runs. Delete `.sandbox/` for a clean slate.
