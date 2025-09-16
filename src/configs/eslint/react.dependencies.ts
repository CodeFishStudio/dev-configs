import { dependencies as baseDependencies } from './base.dependencies.js';

/**
 * Dependencies required for the React Universal ESLint configuration
 */
export const dependencies = {
    ...baseDependencies,
    'eslint-plugin-react': '^7.37',
    'eslint-plugin-react-hooks': '6.0.0-rc.1',
} as const;
