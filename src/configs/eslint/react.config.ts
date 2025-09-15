import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import * as reactHooks from 'eslint-plugin-react-hooks';

import { baseConfig, dependencies as baseDependencies } from './base.config.js';

/**
 * Dependencies required for the React Universal ESLint configuration
 */
export const dependencies = {
    ...baseDependencies,
    'eslint-plugin-react': '^7.37',
    'eslint-plugin-react-hooks': '6.0.0-rc.1',
} as const;

const reactPluginConfig = {
    ...reactPlugin.configs.flat.recommended,
    settings: {
        react: { version: 'detect' },
    },
};

/**
 * React project ESLint configuration. Used across web and React Native
 * projects.
 */
export const reactConfig = defineConfig([
    ...baseConfig,

    importPlugin.flatConfigs.react,
    reactPluginConfig,
    reactPlugin.configs.flat['jsx-runtime']!,
    reactHooks.configs.recommended,
    {
        rules: {
            // Turns prop={'value'} into prop="value"
            'react/jsx-curly-brace-presence': ['warn', 'never'],

            // Prevent useless fragments
            'react/jsx-no-useless-fragment': 'warn',

            // Using Typescript for prop typing
            'react/prop-types': 'off',
        },
    },
]);
