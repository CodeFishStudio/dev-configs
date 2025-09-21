# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## 📦 Installation

**Using pnpm**

```bash
pnpm add -D github:CodeFishStudio/cfs-dev-configs#v0.0.13
```

**Using npm**

```bash
npm i -D github:CodeFishStudio/cfs-dev-configs#v0.0.13
```

## ⚡ Auto Setup

Run the install script to automatically set up your project's dev configs:

```bash
npx cfs-setup
```

This script will provide options to:

- Setup Prettier
- Setup ESLint
- Setup TypeScript
- Setup Cursor rules/settings

Also installs relevant dependencies, adds package.json scripts and adds .gitignore patterns.

## 🔧 Manual Setup

Refer to the [Manual Setup](./docs/MANUAL_SETUP.md) instructions.
