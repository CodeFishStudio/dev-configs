/**
 * ESLint package.json scripts
 */
export declare const eslintScripts: readonly [{
    readonly name: "lint";
    readonly command: "eslint . --fix";
}, {
    readonly name: "lint:check";
    readonly command: "eslint .";
}, {
    readonly name: "check";
    readonly command: "{{PACKAGE_MANAGER}} run lint:check && {{PACKAGE_MANAGER}} run types && {{PACKAGE_MANAGER}} run prettier:check";
}];
