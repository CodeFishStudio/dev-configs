/**
 * Mimics the ESLint config file that comes from the `create @tanstack/start@latest` tool.
 */
export const reactTanStackStartEslintTemplate = `import { eslintConfigs, mergeEslintConfigPlugins } from '@codefish/dev-configs';
import { tanstackConfig } from '@tanstack/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...mergeConfigPlugins([...tanstackConfig, ...eslintConfigs.reactTanStackStart]),

    // Add any overrides below
]);
`;
