# Manual Setup

This document provides detailed instructions for manually setting up each configuration type.

## 📘 TypeScript

1. Install TypeScript as a dev dependency:

    ```bash
    bun add -d typescript@^5.8
    ```

2. Copy the relevant TypeScript config file from `/src/configs/typescript` to your
   project and rename as `tsconfig.json`.

    | Project Type    | Config                                                  |
    | --------------- | ------------------------------------------------------- |
    | Next.js         | `/src/configs/typescript/nextjs.config.json`            |
    | TanStack Start  | `/src/configs/typescript/tanstackStart.config.json`       |
    | Vite            | `/src/configs/typescript/vite.config.json`              |
    | Expo            | `/src/configs/typescript/expo.config.json`              |
    | Node            | `/src/configs/typescript/node.config.json`              |

## 🎨 Prettier

1. Install Prettier as a dev dependency:

    ```bash
    bun add -D prettier
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

## 🔍 ESLint

1. Install eslint dependencies by referring to the `dependencies` const exported
   from the relevant eslint config in `src/configs/eslint/[projectType].config.ts`

    > **💡 Tip:** This is much easier to do via the [Auto Setup](../README.md) tool.

2. Create an `eslint.config.js` file in your project root that exports or
   extends our base eslint config:

    ```javascript
    import { eslintConfigs } from '@codefish/dev-configs';

    export default eslintConfigs.expo;
    ```

    Or if you need to customise the configuration:

    ```javascript
    import { defineConfig } from 'eslint/config';
    import { eslintConfigs } from '@codefish/dev-configs';

    export default defineConfig([
        ...eslintConfigs.expo,
        {
            // Your custom rules here
            rules: {
                'no-console': 'warn',
            },
        },
    ]);
    ```

    #### Available Configs

    | Project Type   | Config                            |
    | -------------- | --------------------------------- |
    | Next.js        | `eslintConfigs.nextjs`            |
    | TanStack Start | `eslintConfigs.tanstackStart`       |
    | Vite           | `eslintConfigs.vite`              |
    | Expo           | `eslintConfigs.expo`              |
    | Node           | `eslintConfigs.node`              |

## ⚙️ IDE Settings

1. #### Settings

    Copy contents from `/src/configs/editors/settings` to your root project directory.
