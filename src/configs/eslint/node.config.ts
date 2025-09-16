import globals from 'globals';

import { baseConfig } from './base.config.js';

import type { Linter } from 'eslint';

/**
 * Node project ESLint configuration.
 */
export const nodeConfig: Linter.Config[] = [
    ...baseConfig,

    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
    },
];
