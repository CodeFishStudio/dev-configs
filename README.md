# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## Installation

1. Install the package:

    ```bash
    pnpm i -D github:CodeFishStudio/cfs-dev-configs#v0.0.5
    ```

2. Run the install script to automatically set up all required dev dependencies:

    ```bash
    npx cfs-dev-setup
    ```

    This script will:
    - Detect your package manager (npm, pnpm, or yarn)
    - Prompt you to choose between React or React Native configuration
    - Install the appropriate ESLint dependencies for your chosen config
    - Provide next steps for configuration

## ESLint Config

Create an `eslint.config.js` file in your project root:

```javascript
import { eslintConfigs } from 'cfs-dev-configs';

export default eslintConfigs.react;
```

Or if you need to customise the configuration:

```javascript
import { defineConfig } from 'eslint/config';
import { eslintConfigs } from 'cfs-dev-configs';

export default defineConfig([
    ...eslintConfigs.react,
    {
        // Your custom rules here
        rules: {
            'no-console': 'warn',
        },
    },
]);
```

### Available Configurations

- `eslintConfigs.react` - TypeScript React web projects
- `eslintConfigs.reactNative` - TypeScript React Native projects
