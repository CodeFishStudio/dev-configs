/**
 * Prettier package.json scripts
 */
export const prettierScripts = [
    {
        name: 'format',
        command: 'npx prettier . --write',
    },
] as const;
