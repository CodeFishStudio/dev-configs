import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { reactConfig, dependencies as reactDependencies } from './react.config.js';

/**
 * Dependencies required for the React (Next.js) ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    '@eslint/eslintrc': '^3',
} as const;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

/**
 * React (Next.js) project ESLint configuration. Merged with the configuration
 * that comes from the `create next-app` tool.
 */
export const reactNextConfig = defineConfig([
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...reactConfig,
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    },
]);
