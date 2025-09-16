import { dependencies as reactDependencies } from './react.dependencies.js';

/**
 * Dependencies required for the React (Vite + React Router) ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    globals: '^16.3',
} as const;
