import prettierConfig from 'eslint-config-prettier/flat';

import { nodeConfig } from './node.config.js';
import { reactNativeConfig } from './reactNative.config.js';
import { reactNextConfig } from './reactNext.config.js';
import { reactViteConfig } from './reactVite.config.js';
import { ProjectType } from '../../types/index.js';

import type { Linter } from 'eslint';

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
        ...reactNextConfig,

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
