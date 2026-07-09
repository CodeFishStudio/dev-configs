import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import reactPlugin, { ReactFlatConfig } from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { baseConfig } from './base.config.js';

/**
 * React project ESLint configuration. Used across web and React Native
 * projects.
 */
export const reactConfig = defineConfig([
    ...baseConfig,

    importPlugin.flatConfigs.react,
    reactPlugin.configs.flat.recommended as ReactFlatConfig,
    reactPlugin.configs.flat['jsx-runtime'] as ReactFlatConfig,
    reactHooks.configs.flat.recommended,
    {
        rules: {
            // Turns prop={'value'} into prop="value"
            'react/jsx-curly-brace-presence': ['warn', 'never'],

            // Prevent useless fragments
            'react/jsx-no-useless-fragment': 'warn',

            // Allow unstable nested components to be used as props
            'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],

            // Using Typescript for prop typing
            'react/prop-types': 'off',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
]);
