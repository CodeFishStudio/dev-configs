/**
 * Dependencies required for the React (Next.js) ESLint configuration
 */
export declare const dependencies: {
    readonly '@eslint/eslintrc': "^3";
    readonly 'eslint-plugin-react': "^7.37";
    readonly 'eslint-plugin-react-hooks': "6.0.0-rc.1";
    readonly '@eslint/js': "^9";
    readonly eslint: "^9";
    readonly 'eslint-config-prettier': "^10";
    readonly 'eslint-plugin-import': "^2.32";
    readonly 'typescript-eslint': "^8";
};
/**
 * React (Next.js) project ESLint configuration. Merged with the configuration
 * that comes from the `create next-app` tool.
 */
export declare const reactNextConfig: import("eslint").Linter.Config<import("eslint").Linter.RulesRecord>[];
