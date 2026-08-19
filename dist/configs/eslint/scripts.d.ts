/**
 * ESLint package.json scripts
 */
export declare const eslintScripts: readonly [{
    readonly name: "lint";
    readonly command: "eslint . --cache --fix";
}, {
    readonly name: "lint:check";
    readonly command: "eslint .";
}, {
    readonly name: "fix";
    readonly command: "{{PACKAGE_MANAGER}} run lint && {{PACKAGE_MANAGER}} run types && {{PACKAGE_MANAGER}} run format";
}, {
    readonly name: "check";
    readonly command: "{{PACKAGE_MANAGER}} run lint:check && {{PACKAGE_MANAGER}} run types && {{PACKAGE_MANAGER}} run format:check";
}];
