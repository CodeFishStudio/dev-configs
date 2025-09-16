import globals from 'globals';
import { baseConfig } from './base.config.js';
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
//# sourceMappingURL=node.config.js.map