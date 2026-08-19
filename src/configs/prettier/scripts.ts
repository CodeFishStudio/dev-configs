/**
 * Prettier package.json scripts
 */
export const prettierScripts = [
    {
        name: 'format',
        command: '{{PACKAGE_MANAGER}} prettier . --write --cache --log-level=error',
    },
    {
        name: 'format:check',
        command: '{{PACKAGE_MANAGER}} prettier . --check',
    },
] as const;
