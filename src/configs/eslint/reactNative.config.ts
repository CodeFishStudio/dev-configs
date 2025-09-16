import { fixupPluginRules } from '@eslint/compat';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactNativePlugin from 'eslint-plugin-react-native';

import { reactConfig } from './react.config.js';

/**
 * Expo React Native project ESLint configuration.
 */
export const reactNativeConfig = defineConfig([
    ...reactConfig,

    globalIgnores([
        'android/**',
        'ios/**',
        '.expo/**',
        '.expo-shared/**',
        'plugins/**',
        'metro.config.js',
        'babel.config.js',
    ]),

    /**
     * The 'eslint-plugin-react-native' plugin is a non-official plugin that is
     * no longer updated. It doesn't have a ESLint flat config supported
     * version, so need to use a compatibility wrapper
     *
     * React Native has an official ESLint plugin, but it doesn't yet support
     * ESLint's flat config format:
     * https://github.com/facebook/react-native/issues/42996
     *
     * Expo also has an official ESLint plugin, but it seemed too opinionated
     * and didn't work as a drop-in config - it introduced conflicts with our
     * own configuration.
     *
     * Hence, sticking with the non-official plugin until the official plugin
     * supports ESLint's flat config format.
     */
    {
        name: 'eslint-plugin-react-native',
        plugins: {
            'react-native': fixupPluginRules({
                rules: reactNativePlugin.rules,
            }),
        },
    },

    {
        rules: {
            // `require` imports are fine in React Native
            '@typescript-eslint/no-require-imports': 'off',

            // Not integral. Is violated by packages like 'expo-constants'
            'import/no-named-as-default': 'off',

            // Warn about console.X usage in React Native
            'no-console': 'warn',
        },
    },
]);
