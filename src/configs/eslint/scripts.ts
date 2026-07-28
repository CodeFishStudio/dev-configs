/**
 * ESLint package.json scripts
 */
export const eslintScripts = [
    {
        name: 'lint',
        command: 'eslint . --fix',
    },
    {
        name: 'lint:check',
        command: 'eslint .',
    },
    {
        name: 'check',
        command:
            '{{PACKAGE_MANAGER}} run lint:check && {{PACKAGE_MANAGER}} run types && {{PACKAGE_MANAGER}} run prettier:check',
    },
] as const;

