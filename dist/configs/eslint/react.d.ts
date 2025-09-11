/**
 * Dependencies required for the React Universal ESLint configuration
 */
export declare const dependencies: {
    readonly 'eslint-plugin-react': ">= 7.37";
    readonly 'eslint-plugin-react-hooks': "6.0.0-rc.1";
    readonly '@eslint/js': ">= 9";
    readonly eslint: ">= 9";
    readonly 'eslint-config-prettier': ">= 10";
    readonly 'eslint-plugin-import': ">= 2.32";
    readonly 'typescript-eslint': ">= 8";
};
/**
 * React project ESLint configuration. Used across web and React Native
 * projects.
 */
export declare const reactConfig: import("eslint").Linter.Config<import("eslint").Linter.RulesRecord>[];
