/**
 * ESLint package.json scripts
 */
export const eslintScripts = [
    {
        name: 'lint',
        command: 'eslint . --cache --fix',
    },
    {
        name: 'lint:check',
        command: 'eslint .',
    },
    {
        name: 'fix',
        command: '{{PACKAGE_MANAGER}} run lint && {{PACKAGE_MANAGER}} run types && {{PACKAGE_MANAGER}} run format',
    },
    {
        name: 'check',
        command: '{{PACKAGE_MANAGER}} run lint:check && {{PACKAGE_MANAGER}} run types && {{PACKAGE_MANAGER}} run format:check',
    },
];
//# sourceMappingURL=scripts.js.map