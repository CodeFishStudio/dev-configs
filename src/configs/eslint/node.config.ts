import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { baseConfig } from './base.config.js';

/**
 * Node project ESLint configuration.
 */
export const nodeConfig = defineConfig([
    ...baseConfig,

    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
        },
    },
]);
