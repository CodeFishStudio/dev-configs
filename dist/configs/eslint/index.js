import prettierConfig from 'eslint-config-prettier/flat';
import { expoConfig } from './expo.config.js';
import { nodeConfig } from './node.config.js';
import { reactConfig } from './react.config.js';
import { tanstackStartConfig } from './tanstackStart.config.js';
import { filterOutPlugins } from './utils/filterOutPlugins.js';
import { mergeEslintConfigPlugins } from './utils/mergeEslintConfigPlugins.js';
import { viteConfig } from './vite.config.js';
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
        // Filter out configs that define plugins that will be included in
        // 'eslint-config-next/core-web-vitals' (see nextjs.template.ts)
        ...filterOutPlugins(reactConfig, ['import', 'react-hooks', 'react']),
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
};
export { eslintConfigs, mergeEslintConfigPlugins };
//# sourceMappingURL=index.js.map