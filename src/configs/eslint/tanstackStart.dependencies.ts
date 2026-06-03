import { dependencies as reactDependencies } from './react.dependencies.js';

/**
 * Dependencies required for the React (TanStack Start) ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    globals: '^16.3',
} as const;
