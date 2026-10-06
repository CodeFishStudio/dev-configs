import eslint from '@eslint/js';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

/**
 * Base ESLint configuration with our fundamental rules for TypeScript projects
 */
export const baseConfig = defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,

    // Registered on its own so `filterOutPlugins` can drop it for frameworks that
    // bring their own `import` plugin (e.g. eslint-config-next) while keeping the
    // `import/*` rules below.
    {
        name: 'codefish/import-plugin',
        plugins: { import: importPlugin },
    },
    {
        plugins: eslintComments.recommended.plugins,
        linterOptions: {
            // An eslint-disable that no longer matches a reported problem is an error
            reportUnusedDisableDirectives: 'error',
        },
        settings: {
            // Lets `import/order` classify path aliases (e.g. `@/…`) as internal
            'import/resolver': 'typescript',
        },
        rules: {
            // Every suppression needs a `-- reason` so it can be reviewed
            '@eslint-community/eslint-comments/require-description': 'error',

            // Allow empty TypeScript interfaces that extend other interfaces
            '@typescript-eslint/no-empty-object-type': [
                'warn',
                { allowInterfaces: 'with-single-extends' },
            ],

            // Prevent use of non-null assertion (i.e. the TypeScript `!` operator)
            '@typescript-eslint/no-non-null-assertion': 'error',

            // Disallow `new Array()` in favor of array literals
            'no-array-constructor': 'off',
            '@typescript-eslint/no-array-constructor': 'warn',

            // Disallow wrapper object types (e.g. `String` instead of `string`)
            '@typescript-eslint/no-wrapper-object-types': 'warn',

            // Prefer `as const` over type assertions for literal values
            '@typescript-eslint/prefer-as-const': 'warn',

            // Require `namespace` instead of `module` for TypeScript namespaces
            '@typescript-eslint/prefer-namespace-keyword': 'warn',

            // Require type imports to use `import type` syntax
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                },
            ],

            // Only the eslint-plugin-import rules TypeScript can't check and that don't
            // parse other modules. The rest are slow or duplicate type checking, see
            // https://typescript-eslint.io/troubleshooting/typed-linting/performance/#eslint-plugin-import

            // Merge multiple imports from the same module
            'import/no-duplicates': 'warn',

            // Configure import ordering
            'import/order': [
                'warn',
                {
                    groups: [
                        ['builtin', 'external'],
                        ['internal', 'object', 'index'],
                        ['sibling', 'parent'],
                        ['type'],
                    ],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    distinctGroup: false,
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'react-native',
                            group: 'external',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'object', 'type'],
                    sortTypesGroup: true,
                    'newlines-between': 'never',
                },
            ],

            // Prevent { key: key } in object declarations
            'object-shorthand': ['warn', 'always'],

            // Auto fix value + string into `${value}${string}`
            'prefer-template': 'warn',
        },
    },

    /* --------------------------------------------------------
     * Type-aware rules
     * -------------------------------------------------------- */
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        languageOptions: {
            parserOptions: {
                // Finds each file's tsconfig from the ESLint working directory.
                // Monorepo packages need to set `parserOptions.tsconfigRootDir`
                // in their own ESLint config.
                projectService: true,
            },
        },
        rules: {
            // Disallow duplicate members in union or intersection types
            '@typescript-eslint/no-duplicate-type-constituents': 'error',

            // Disallow type assertions that do not change the type of an expression
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',

            // Prevent use of floating promises
            '@typescript-eslint/no-floating-promises': 'warn',

            // Disallow truthiness checks on numbers and nullable primitives (e.g. `if (!id)` when
            // `id` may be `0` or when `id` is `number | undefined`). Prefer explicit nullish checks.
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                {
                    allowNumber: false,
                    allowNullableBoolean: true,
                    allowNullableString: true,
                    allowNullableEnum: true,
                    // Allowing any as it is common to perform a boolean check
                    // on an `error` coming from a try/catch which is typed as
                    // unknown and would otherwise trigger this error.
                    allowAny: true,
                },
            ],

            // Every union or enum member needs its own case. A default clause does not count,
            // so adding a member fails until each switch that handles it is updated.
            '@typescript-eslint/switch-exhaustiveness-check': [
                'error',
                { considerDefaultExhaustiveForUnions: true },
            ],
        },
    },

    /* --------------------------------------------------------
     * Global ignores
     * -------------------------------------------------------- */
    globalIgnores(['docs/**', '.agents/**']),
]);
