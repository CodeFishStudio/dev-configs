// @ts-check

import prettierConfig from 'eslint-config-prettier/flat';
import { baseConfig } from './eslint-configs/base.js';
import { reactUniversalConfig } from './eslint-configs/reactUniversal.js';
import { reactWebConfig } from './eslint-configs/reactWeb.js';
import { reactNativeConfig } from './eslint-configs/reactNative.js';

export const eslintConfigs = {
    /**
     * CodeFish Studio ESLint configuration for React + TypeScript projects
     * @type {import('eslint').Linter.Config[]}
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
     * @type {import('eslint').Linter.Config[]}
     */
    reactNative: [
        ...baseConfig,
        ...reactUniversalConfig,
        ...reactNativeConfig,

        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
};
