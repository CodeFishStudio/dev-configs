import prettierConfig from 'eslint-config-prettier/flat';
import { nodeConfig } from './configs/eslint/node.config.js';
import { reactNativeConfig } from './configs/eslint/reactNative.config.js';
import { reactWebConfig } from './configs/eslint/reactWeb.config.js';
export const eslintConfigs = {
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
//# sourceMappingURL=index.js.map