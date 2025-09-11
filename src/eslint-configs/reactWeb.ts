import type { Linter } from 'eslint';
import globals from 'globals';

/**
 * Web React project ESLint configuration.
 */
export const reactWebConfig: Linter.Config[] = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
];
