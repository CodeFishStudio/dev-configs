import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { reactConfig, dependencies as reactDependencies } from './react.js';
/**
 * Dependencies required for the web ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    globals: '^16.3',
};
/**
 * Web project ESLint configuration.
 */
export const reactWebConfig = defineConfig([
    ...reactConfig,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
]);
//# sourceMappingURL=reactWeb.js.map