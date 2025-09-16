# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## 📦 Installation

**Using pnpm**

```bash
pnpm add -D github:CodeFishStudio/cfs-dev-configs#v0.0.5
```

**Using npm**

```bash
npm i -D github:CodeFishStudio/cfs-dev-configs#v0.0.5
```

## ⚡ Auto Setup (Recommended)

Run the install script to automatically set up your project's dev configs:

```bash
npx cfs-setup
```

This script will provide options to:

- Setup Prettier
- Setup TypeScript
- Setup ESLint and install dependencies
- Setup IDE settings
- Add relevant package.json scripts
- Add relevant .gitignore patterns

## 🔧 Manual Setup

### TypeScript

1. Install TypeScript as a dev dependency:

    ```bash
    pnpm add -D typescript@^5.8
    ```

2. Copy the relevant TypeScript config file from `/src/configs/typescript` to your
   project and rename as `tsconfig.json`.

    | Project Type                | Config                                            |
    | --------------------------- | ------------------------------------------------- |
    | React (Next.js)             | `/src/configs/typescript/reactNext.config.json`   |
    | React (Vite + React Router) | `/src/configs/typescript/reactVite.config.json`   |
    | React Native (Expo)         | `/src/configs/typescript/reactNative.config.json` |
    | Node.js                     | `/src/configs/typescript/node.config.json`        |

### Prettier

1. Install Prettier as a dev dependency:

    ```bash
    pnpm add -D prettier
    ```

2. Create a `.prettierrc` file in your project root:

    ```json
    {
        "printWidth": 100,
        "singleQuote": true,
        "tabWidth": 4,
        "trailingComma": "es5"
    }
    ```

### ESLint

1. Install eslint dependencies by referring to the `dependencies` const exported
   from the relevant eslint config in `src/configs/eslint/[projectType].config.ts`

    > **💡 Tip:** This is much easier to do via the Auto Setup detailed above.

2. Create an `eslint.config.js` file in your project root that exports or
   extends our base eslint config:

    ```javascript
    import { eslintConfigs } from 'cfs-dev-configs';

    export default eslintConfigs.reactNative;
    ```

    Or if you need to customise the configuration:

    ```javascript
    import { defineConfig } from 'eslint/config';
    import { eslintConfigs } from 'cfs-dev-configs';

    export default defineConfig([
        ...eslintConfigs.reactNative,
        {
            // Your custom rules here
            rules: {
                'no-console': 'warn',
            },
        },
    ]);
    ```

    #### Available Configs

    | Project Type                | Config                      |
    | --------------------------- | --------------------------- |
    | React (Next.js)             | `eslintConfigs.reactNext`   |
    | React (Vite + React Router) | `eslintConfigs.reactVite`   |
    | React Native (Expo)         | `eslintConfigs.reactNative` |
    | Node.js                     | `eslintConfigs.node`        |

## 📝 Todo

- Include AI/Cursor rules for project type
