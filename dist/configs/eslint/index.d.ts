import { mergeEslintConfigPlugins } from './utils/mergeEslintConfigPlugins.js';
import type { Linter } from 'eslint';
import type { ProjectType } from '../../types/index.js';
declare const eslintConfigs: Record<ProjectType | 'shadcn', Linter.Config[]>;
/**
 * Pins the TypeScript project root for type-aware rules such as
 * `@typescript-eslint/no-floating-promises`.
 *
 * Append this after a preset in a monorepo, when ESLint is not started from the
 * directory that contains that package's `tsconfig.json`.
 *
 * @param tsconfigRootDir - Pass `import.meta.dirname` from the package `eslint.config.js`.
 * @returns An ESLint flat-config block that sets `parserOptions.tsconfigRootDir`.
 *
 * @example
 * export default defineConfig([
 *     ...eslintConfigs.vite,
 *     monorepoTsconfigRoot(import.meta.dirname),
 * ]);
 */
export declare const monorepoTsconfigRoot: (tsconfigRootDir: string) => Linter.Config;
export { eslintConfigs, mergeEslintConfigPlugins };
