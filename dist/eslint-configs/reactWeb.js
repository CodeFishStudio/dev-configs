import globals from 'globals';
/**
 * Web React project ESLint configuration.
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
//# sourceMappingURL=reactWeb.js.map