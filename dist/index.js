import prettierConfig from 'eslint-config-prettier/flat';
import { baseConfig } from './eslint-configs/base';
import { nodeConfig } from './eslint-configs/node';
import { reactNativeConfig } from './eslint-configs/reactNative';
import { reactUniversalConfig } from './eslint-configs/reactUniversal';
import { webConfig } from './eslint-configs/web';
export const eslintConfigs = {
    /**
     * CodeFish Studio ESLint configuration for Node.js + TypeScript projects
     */
    node: [
        ...baseConfig,
        ...nodeConfig,
        // Prettier must come last to override conflicting rules
        prettierConfig,
    ],
    /**
     * CodeFish Studio ESLint configuration for React + TypeScript projects
     */
    react: [
        ...baseConfig,
        ...webConfig,
        ...reactUniversalConfig,
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
//# sourceMappingURL=index.js.map