import globals from 'globals';
/**
 * Web project ESLint configuration.
 */
export const webConfig = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
];
//# sourceMappingURL=web.js.map