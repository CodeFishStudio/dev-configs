import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { reactConfig } from './react.config.js';
/**
 * TanStack Start project ESLint configuration.
 */
export const tanstackStartConfig = defineConfig([
    ...reactConfig,
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            },
        },
    },
]);
//# sourceMappingURL=tanstackStart.config.js.map