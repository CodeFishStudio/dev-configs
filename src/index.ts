import type { Linter } from 'eslint';
import prettierConfig from 'eslint-config-prettier/flat';
import { baseConfig } from './eslint-configs/base';
import { reactUniversalConfig } from './eslint-configs/reactUniversal';
import { reactWebConfig } from './eslint-configs/reactWeb';
import { reactNativeConfig } from './eslint-configs/reactNative';

export const eslintConfigs: Record<string, Linter.Config[]> = {
    /**
     * CodeFish Studio ESLint configuration for Node.js + TypeScript projects
     */
    node: [
        ...baseConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],

    /**
     * CodeFish Studio ESLint configuration for React + TypeScript projects
     */
    react: [
        ...baseConfig,
        ...reactUniversalConfig,
        ...reactWebConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],

    /**
     * CodeFish Studio ESLint configuration for React Native + TypeScript projects
     */
    reactNative: [
        ...baseConfig,
        ...reactUniversalConfig,
        ...reactNativeConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
};
