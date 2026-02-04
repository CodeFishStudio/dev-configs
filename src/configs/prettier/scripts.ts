/**
 * Prettier package.json scripts
 */
export const prettierScripts = [
    {
        name: 'format',
        command: 'bun prettier . --write',
    },
] as const;
