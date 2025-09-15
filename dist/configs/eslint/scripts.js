/**
 * ESLint package.json scripts
 */
export const eslintScripts = [
    {
        name: 'lint',
        command: 'eslint . --cache',
    },
    {
        name: 'check',
        command: '{{PACKAGE_MANAGER}} run lint && {{PACKAGE_MANAGER}} run types',
    },
];
//# sourceMappingURL=scripts.js.map