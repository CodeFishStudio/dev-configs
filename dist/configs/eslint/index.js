import prettierConfig from 'eslint-config-prettier/flat';
import { expoConfig } from './expo.config.js';
import { nodeConfig } from './node.config.js';
import { reactConfig } from './react.config.js';
import { shadcnConfig } from './shadcn.config.js';
import { tanstackStartConfig } from './tanstackStart.config.js';
import { filterOutPlugins } from './utils/filterOutPlugins.js';
import { mergeEslintConfigPlugins } from './utils/mergeEslintConfigPlugins.js';
import { viteConfig } from './vite.config.js';
import { webGlobalIgnores } from './webIgnores.js';
const eslintConfigs = {
    /**
     * CodeFish Studio ESLint configuration for Node.js + TypeScript projects
     */
    node: [
        ...nodeConfig,
        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
    /**
     * CodeFish Studio ESLint configuration for Next.js + TypeScript projects
     */
    nextjs: [
        // Filter out configs that define plugins already included by
        // eslint-config-next (see nextjs.template.ts): core-web-vitals and typescript
        ...filterOutPlugins(reactConfig, ['import', 'react-hooks', 'react', '@typescript-eslint']),
        webGlobalIgnores,
        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
    /**
     * CodeFish Studio ESLint configuration for TanStack Start + TypeScript projects
     */
    tanstackStart: [
        ...tanstackStartConfig,
        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
    /**
     * CodeFish Studio ESLint configuration for Vite + React Router + TypeScript projects
     */
    vite: [
        ...viteConfig,
        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
    /**
     * CodeFish Studio ESLint configuration for Expo React Native + TypeScript projects
     */
    expo: [
        ...expoConfig,
        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
    /**
     * CodeFish Studio shadcn/ui design-system ESLint configuration. Extend alongside a web
     * project config, e.g. `[...eslintConfigs.nextjs, ...eslintConfigs.shadcn]`.
     */
    shadcn: shadcnConfig,
};
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
export const monorepoTsconfigRoot = (tsconfigRootDir) => ({
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
        parserOptions: {
            tsconfigRootDir,
        },
    },
});
export { eslintConfigs, mergeEslintConfigPlugins };
//# sourceMappingURL=index.js.map