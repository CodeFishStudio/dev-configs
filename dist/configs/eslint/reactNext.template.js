/**
 * Mimics the ESLint config file that comes from the `create next-app` tool.
 */
export const reactNextEslintTemplate = `import { eslintConfigs } from '@codefish/dev-configs';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    ...eslintConfigs.reactNext,
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
]);

export default eslintConfig;
`;
//# sourceMappingURL=reactNext.template.js.map