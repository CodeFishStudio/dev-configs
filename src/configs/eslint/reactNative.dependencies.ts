import { dependencies as reactDependencies } from './react.dependencies.js';

/**
 * Dependencies required for the React Native ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    '@eslint/compat': '^1',
    'eslint-plugin-react-native': '^5',
} as const;
