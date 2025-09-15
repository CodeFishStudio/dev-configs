/**
 * ESLint package.json scripts
 */
export declare const eslintScripts: readonly [{
    readonly name: "lint";
    readonly command: "eslint . --cache";
}, {
    readonly name: "check";
    readonly command: "{{PACKAGE_MANAGER}} run lint && {{PACKAGE_MANAGER}} run types";
}];
