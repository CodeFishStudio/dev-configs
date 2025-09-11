import globals from 'globals';

import type { Linter } from 'eslint';

/**
 * Node project ESLint configuration.
 */
export const nodeConfig: Linter.Config[] = [
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
    },
];
