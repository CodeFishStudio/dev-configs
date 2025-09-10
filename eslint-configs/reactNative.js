// @ts-check

/**
 * React Native project ESLint configuration.
 * @type {import('eslint').Linter.Config[]}
 */
export const reactNativeConfig = [
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
];
