import { defineConfig } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import { baseConfig } from './base.config.js';
import type { ReactFlatConfig } from 'eslint-plugin-react';

/**
 * React project ESLint configuration. Used across web and React Native
 * projects.
 */
export const reactConfig = defineConfig([
    ...baseConfig,

    reactPlugin.configs.flat.recommended as ReactFlatConfig,
    reactPlugin.configs.flat['jsx-runtime'] as ReactFlatConfig,
    reactHooks.configs.flat.recommended,
    reactYouMightNotNeedAnEffect.configs.recommended,
    {
        rules: {
            // Turns prop={'value'} into prop="value"
            'react/jsx-curly-brace-presence': ['warn', 'never'],

            // Prevent un-memoed context `value` props
            'react/jsx-no-constructed-context-values': 'error',

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
