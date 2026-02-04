/**
 * Mimics the ESLint config file that comes from the `create @tanstack/start@latest` tool.
 */
export declare const reactTanStackStartEslintTemplate = "import { eslintConfigs, mergeEslintConfigPlugins } from '@codefish/dev-configs';\nimport { tanstackConfig } from '@tanstack/eslint-config';\nimport { defineConfig } from 'eslint/config';\n\nexport default defineConfig([\n    ...mergeEslintConfigPlugins([...tanstackConfig, ...eslintConfigs.reactTanStackStart]),\n\n    // Add any overrides below\n]);\n";
