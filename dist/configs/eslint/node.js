import globals from 'globals';
import { baseConfig, dependencies as baseDependencies } from './base.js';
/**
 * Dependencies required for the Node.js ESLint configuration
 */
export const dependencies = {
    ...baseDependencies,
    globals: '>= 16.3',
};
/**
 * Node project ESLint configuration.
 */
export const nodeConfig = [
    ...baseConfig,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
    },
];
//# sourceMappingURL=node.js.map