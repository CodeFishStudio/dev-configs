import { dependencies as baseDependencies } from './base.dependencies.js';

/**
 * Dependencies required for the Node.js ESLint configuration
 */
export const dependencies = {
    ...baseDependencies,
    '@types/node': '^24',
    globals: '^16.3',
} as const;
