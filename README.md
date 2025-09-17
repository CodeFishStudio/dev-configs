# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## 📦 Installation

**Using pnpm**

```bash
pnpm add -D github:CodeFishStudio/cfs-dev-configs#v0.0.11
```

**Using npm**

```bash
npm i -D github:CodeFishStudio/cfs-dev-configs#v0.0.11
```

## ⚡ Auto Setup

Run the install script to automatically set up your project's dev configs:

```bash
npx cfs-setup
```

This script will provide options to:

- Setup Prettier
- Setup TypeScript
- Setup ESLint and install dependencies
- Setup Cursor settings

Also adds relevant package.json scripts and .gitignore patterns.

## 🔧 Manual Setup

Refer to the [Manual Setup](./docs/MANUAL_SETUP.md) instructions.
