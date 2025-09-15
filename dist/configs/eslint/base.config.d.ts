import type { Linter } from 'eslint';
/**
 * Dependencies required for the base ESLint configuration
 */
export declare const dependencies: {
    readonly '@eslint/js': "^9";
    readonly eslint: "^9";
    readonly 'eslint-config-prettier': "^10";
    readonly 'eslint-plugin-import': "^2.32";
    readonly 'typescript-eslint': "^8";
};
/**
 * Base ESLint configuration with our fundamental rules for TypeScript projects
 */
export declare const baseConfig: Linter.Config[];
