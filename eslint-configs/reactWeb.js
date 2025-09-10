import globals from 'globals';

/**
 * Web React project ESLint configuration.
 * @type {import('eslint').Linter.Config[]}
 */
export const reactWebConfig = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
];
