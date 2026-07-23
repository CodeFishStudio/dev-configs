import reactNativeConfig from '@react-native/eslint-config/flat';
import { defineConfig } from 'eslint/config';
import { reactConfig } from './react.config.js';
import { filterOutPlugins } from './utils/filterOutPlugins.js';

/**
 * Expo React Native project ESLint configuration.
 */
export const expoConfig = defineConfig([
    // `@react-native/eslint-config/flat` registers react and react-hooks;
    // filter them from reactConfig to avoid ESLint 9 plugin redefinition errors.
    ...filterOutPlugins(reactConfig, ['react', 'react-hooks']),
    ...reactNativeConfig,

    {
        rules: {
            // `require` imports are fine in React Native
            '@typescript-eslint/no-require-imports': 'off',

            // Not integral. Is violated by packages like 'expo-constants'
            'import/no-named-as-default': 'off',

            // Warn about console.X usage in React Native
            'no-console': 'warn',

            // React Native enables this, but `void promise()` is a common
            // fire-and-forget pattern when floating promises are not enforced
            'no-void': 'off',
        },
    },
]);
