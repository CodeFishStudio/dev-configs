import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { reactConfig } from './react.config.js';

/**
 * React (Vite + React Router) project ESLint configuration.
 */
export const reactViteConfig = defineConfig([
    ...reactConfig,

    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
]);
