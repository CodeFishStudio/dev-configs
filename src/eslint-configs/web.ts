import globals from 'globals';

import type { Linter } from 'eslint';

/**
 * Web project ESLint configuration.
 */
export const webConfig: Linter.Config[] = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
];
