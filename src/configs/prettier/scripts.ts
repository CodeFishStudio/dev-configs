/**
 * Prettier package.json scripts
 *
 * We use the `prettier.cjs` file instead of the `prettier` command because the
 * `prettier` command can sometimes not use the expected version of Prettier
 * installed as a devDependency. i.e. if another package has an older version of
 * Prettier as a dependency, the `prettier` command will use the older version.
 * This results in mismatches between what version of Prettier the the IDE uses
 * compared to these scripts.
 */
export const prettierScripts = [
    {
        name: 'format',
        command:
            '{{PACKAGE_MANAGER}} ./node_modules/prettier/bin/prettier.cjs . --write --cache --log-level=error',
    },
    {
        name: 'format:check',
        command: '{{PACKAGE_MANAGER}} ./node_modules/prettier/bin/prettier.cjs . --check',
    },
] as const;
