import type { Linter } from 'eslint';
/**
 * Dependencies required for the Node.js ESLint configuration
 */
export declare const dependencies: {
    readonly globals: ">= 16.3";
    readonly '@eslint/js': ">= 9";
    readonly eslint: ">= 9";
    readonly 'eslint-config-prettier': ">= 10";
    readonly 'eslint-plugin-import': ">= 2.32";
    readonly 'typescript-eslint': ">= 8";
};
/**
 * Node project ESLint configuration.
 */
export declare const nodeConfig: Linter.Config[];
