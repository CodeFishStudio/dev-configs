import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
/**
 * Dependencies required for the base ESLint configuration
 */
export const dependencies = {
    '@eslint/js': '^9',
    eslint: '^9',
    'eslint-config-prettier': '^10',
    'eslint-plugin-import': '^2.32',
    'typescript-eslint': '^8',
};
/**
 * Base ESLint configuration with our fundamental rules for TypeScript projects
 */
export const baseConfig = [
    eslint.configs.recommended,
    // @ts-expect-error: typescript-eslint is not typed in a friendly way
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        settings: {
            'import/resolver': 'typescript',
        },
        rules: {
            // Allow empty TypeScript interfaces that extend other interfaces
            '@typescript-eslint/no-empty-object-type': [
                'warn',
                { allowInterfaces: 'with-single-extends' },
            ],
            // Is overly cautious, many packages have duplicated default/named exports
            'import/no-named-as-default-member': 'off',
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
                    pathGroupsExcludedImportTypes: ['react', 'react-native'],
                    'newlines-between': 'always',
                },
            ],
            // Prevent { key: key } in object declarations
            'object-shorthand': ['warn', 'always'],
            // Auto fix value + string into `${value}${string}`
            'prefer-template': 'warn',
        },
    },
];
//# sourceMappingURL=base.js.map