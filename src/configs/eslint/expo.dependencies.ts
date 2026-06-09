import { dependencies as reactDependencies } from './react.dependencies.js';

/**
 * Dependencies required for the React Native ESLint configuration
 */
export const dependencies = {
    ...reactDependencies,
    '@react-native/eslint-config': '^0.85',
} as const;
