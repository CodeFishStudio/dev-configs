import prettierConfig from 'eslint-config-prettier/flat';

import { nodeConfig } from './node.config.js';
import { reactConfig } from './react.config.js';
import { reactNativeConfig } from './reactNative.config.js';
import { reactViteConfig } from './reactVite.config.js';
import { ProjectType } from '../../types/index.js';

import type { Linter } from 'eslint';

const filterOutPlugins = (configs: Linter.Config[], pluginNames: string[]) => {
    return configs.filter((config) => {
        if (!config.plugins) return true;
        return !Object.keys(config.plugins).some((plugin) => pluginNames.includes(plugin));
    });
};

export const eslintConfigs: Record<ProjectType, Linter.Config[]> = {
    /**
     * CodeFish Studio ESLint configuration for Node.js + TypeScript projects
     */
    node: [
        ...nodeConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],

    /**
     * CodeFish Studio ESLint configuration for React (Next.js) + TypeScript projects
     */
    reactNext: [
        // Filter out configs that define plugins that will be included in
        // 'eslint-config-next/core-web-vitals' (see reactNext.template.ts)
        ...filterOutPlugins(reactConfig, ['import', 'react-hooks', 'react']),

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],

    /**
     * CodeFish Studio ESLint configuration for React (Vite + React Router) + TypeScript projects
     */
    reactVite: [
        ...reactViteConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],

    /**
     * CodeFish Studio ESLint configuration for React Native + TypeScript projects
     */
    reactNative: [
        ...reactNativeConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
};
