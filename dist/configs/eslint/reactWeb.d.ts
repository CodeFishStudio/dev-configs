/**
 * Dependencies required for the web ESLint configuration
 */
export declare const dependencies: {
    readonly globals: ">= 16.3";
    readonly 'eslint-plugin-react': ">= 7.37";
    readonly 'eslint-plugin-react-hooks': "6.0.0-rc.1";
    readonly '@eslint/js': ">= 9";
    readonly eslint: ">= 9";
    readonly 'eslint-config-prettier': ">= 10";
    readonly 'eslint-plugin-import': ">= 2.32";
    readonly 'typescript-eslint': ">= 8";
};
/**
 * Web project ESLint configuration.
 */
export declare const reactWebConfig: import("eslint").Linter.Config<import("eslint").Linter.RulesRecord>[];
