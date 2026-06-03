/**
 * Mimics the ESLint config file that comes from the `create @tanstack/start@latest` tool.
 */
export const tanstackStartEslintTemplate = `import { eslintConfigs, mergeEslintConfigPlugins } from '@codefish/dev-configs';
import { tanstackConfig } from '@tanstack/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...mergeEslintConfigPlugins([...tanstackConfig, ...eslintConfigs['tanstack-start']]),

    // Add any overrides below
]);
`;
//# sourceMappingURL=tanstack-start.template.js.map