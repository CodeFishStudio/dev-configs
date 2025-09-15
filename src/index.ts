import prettierConfig from 'eslint-config-prettier/flat';

import { nodeConfig } from './configs/eslint/node.js';
import { reactNativeConfig } from './configs/eslint/reactNative.js';
import { reactWebConfig } from './configs/eslint/reactWeb.js';
import { ProjectType } from './types/index.js';

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
     * CodeFish Studio ESLint configuration for React + TypeScript projects
     */
    react: [
        ...reactWebConfig,

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
