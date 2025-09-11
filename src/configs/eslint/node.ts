import globals from 'globals';

import { baseConfig, dependencies as baseDependencies } from './base.js';

import type { Linter } from 'eslint';

/**
 * Dependencies required for the Node.js ESLint configuration
 */
export const dependencies = {
    ...baseDependencies,
    globals: '>= 16.3',
} as const;

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
