import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { reactConfig, dependencies as reactDependencies } from './react.config.js';
/**
 * Dependencies required for the React (Vite + React Router) ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    globals: '^16.3',
};
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
//# sourceMappingURL=reactVite.config.js.map