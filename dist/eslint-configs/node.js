import globals from 'globals';
/**
 * Node project ESLint configuration.
 */
export const nodeConfig = [
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
    },
];
//# sourceMappingURL=node.js.map