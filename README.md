# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## 📦 Installation

**Using Bun**

```bash
bun add -d @codefish/dev-configs@github:CodeFishStudio/dev-configs#v0.0.27
```

**Using npm**

```bash
npm i -D @codefish/dev-configs@github:CodeFishStudio/dev-configs#v0.0.27
```

## ⚡ Auto Setup

Run the install script to automatically set up your project's dev configs:

```bash
bun cfs-setup
```

This script will provide options to:

- Setup Prettier
- Setup ESLint
- Setup TypeScript
- Setup Cursor rules/settings

Also installs relevant dependencies, adds package.json scripts and adds .gitignore patterns.

## 🔧 Manual Setup

Refer to the [Manual Setup](./docs/MANUAL_SETUP.md) instructions.