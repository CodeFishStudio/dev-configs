/**
 * Prettier package.json scripts
 */
export declare const prettierScripts: readonly [{
    readonly name: "format";
    readonly command: "{{PACKAGE_MANAGER}} prettier . --write --cache --log-level=error";
}, {
    readonly name: "format:check";
    readonly command: "{{PACKAGE_MANAGER}} prettier . --check";
}];
