import prettierConfig from 'eslint-config-prettier/flat';
import { nodeConfig } from './node.config.js';
import { reactConfig } from './react.config.js';
import { reactNativeConfig } from './reactNative.config.js';
import { reactViteConfig } from './reactVite.config.js';
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
     * CodeFish Studio ESLint configuration for React (Next.js) + TypeScript projects
     */
    reactNext: [
        ...reactConfig,
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
//# sourceMappingURL=index.js.map