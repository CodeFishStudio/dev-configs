# CodeFish Studio Dev Configs

Shared configurations for dev tools across CodeFish Studio projects.

## ESLint Config

### Installation

```bash
pnpm add --save-dev github:CodeFishStudio/cfs-dev-configs#v0.0.1 "@eslint/js@>=9" "eslint-config-prettier@>=10" "eslint-import-resolver-typescript@>=4.4" "eslint-plugin-import@>=2.32" "eslint-plugin-react-hooks@6.0.0-rc.1" "eslint-plugin-react@>=7.37" "eslint@>=9" "globals@>=16.3" "typescript-eslint@>=8"
```

### Usage

Create an `eslint.config.js` file in your project root:

```javascript
import { eslintConfig } from 'cfs-dev-configs';

export default eslintConfig.react;
```

Or if you need to customise the configuration:

```javascript
import { defineConfig } from 'eslint/config';
import { eslintConfig } from 'cfs-dev-configs';

export default defineConfig([
    ...eslintConfig.react,
    {
        // Your custom rules here
        rules: {
            'no-console': 'warn',
        },
    },
]);
```

### Available Configurations

- `eslintConfig.react` - ESLint configuration for React + TypeScript projects on web
