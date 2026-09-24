# Manual Setup

This document provides detailed instructions for manually setting up each configuration type.

## 📘 TypeScript

1. Install TypeScript as a dev dependency:

    ```bash
    bun add -d typescript@^5.8
    ```

2. Copy the relevant TypeScript config file from `/src/configs/typescript` to your
   project and rename as `tsconfig.json`.

    | Project Type   | Config                                              |
    | -------------- | --------------------------------------------------- |
    | Next.js        | `/src/configs/typescript/nextjs.config.json`        |
    | TanStack Start | `/src/configs/typescript/tanstackStart.config.json` |
    | Vite           | `/src/configs/typescript/vite.config.json`          |
    | Expo           | `/src/configs/typescript/expo.config.json`          |
    | Node           | `/src/configs/typescript/node.config.json`          |

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

1. Install `@codefish/dev-configs` as a dev dependency.

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

    | Project Type   | Config                        |
    | -------------- | ----------------------------- |
    | Next.js        | `eslintConfigs.nextjs`        |
    | TanStack Start | `eslintConfigs.tanstackStart` |
    | Vite           | `eslintConfigs.vite`          |
    | Expo           | `eslintConfigs.expo`          |
    | Node           | `eslintConfigs.node`          |
    | shadcn/ui      | `eslintConfigs.shadcn`        |

### Design-system rules (shadcn/ui)

`eslintConfigs.shadcn` adds [`@shadcn/lint`](https://github.com/shadcn-ui/lint), which
checks how code uses the shadcn/ui primitives. It reads components, variants, and theme
tokens from `components.json`, so the project needs shadcn/ui on Tailwind v4. Extend it
alongside the project config:

```javascript
export default defineConfig([...eslintConfigs.nextjs, ...eslintConfigs.shadcn]);
```

| Rule                            | What it enforces                                                               |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `shadcn/no-restyle`             | Callers may only place components (layout); appearance belongs in a variant    |
| `shadcn/no-raw-colors`          | Colours come from theme tokens, not the Tailwind palette                       |
| `shadcn/no-arbitrary-values`    | No arbitrary appearance values such as `p-[13px]`; arbitrary layout is allowed |
| `shadcn/no-inline-styles`       | No `style` props or `<style>` elements; use classes and CSS custom properties  |
| `shadcn/require-static-classes` | Class values on components must be readable, e.g. no `` `bg-${color}` ``       |
| `shadcn/no-unknown-classes`     | Classes must be ones the project's Tailwind can generate                       |

`no-restyle` also accepts spacing on every Card element and on `…Content`, `…Header`,
`…Footer`, `…Group`, and `…Panel` slots, and shape on `Skeleton`.
`src/components/ui/**` itself is not linted.

Run `eslint .` without `--cache` after changing a component, variant, or theme: the cache
can skip files that use the changed code.

To relax a rule for a project, override it after the shared config:

```javascript
export default defineConfig([
    ...eslintConfigs.tanstackStart,
    ...eslintConfigs.shadcn,
    {
        rules: {
            'shadcn/no-unknown-classes': 'warn',
        },
    },
]);
```
