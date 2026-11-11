import tanstackQuery from '@tanstack/eslint-plugin-query';
import { defineConfig } from 'eslint/config';
/**
 * TanStack Query ESLint configuration. Extend alongside a project config for any project that
 * uses TanStack Query, e.g. `[...eslintConfigs.expo, ...eslintConfigs.tanstackQuery]`.
 */
export const tanstackQueryConfig = defineConfig(tanstackQuery.configs['flat/recommended']);
//# sourceMappingURL=tanstackQuery.config.js.map