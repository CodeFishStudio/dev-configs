import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { reactConfig } from './react.config.js';
/**
 * Vite + React Router project ESLint configuration.
 */
export const viteConfig = defineConfig([
    ...reactConfig,
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
    },
]);
//# sourceMappingURL=vite.config.js.map