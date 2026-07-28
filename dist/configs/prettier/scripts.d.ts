/**
 * Prettier package.json scripts
 */
export declare const prettierScripts: readonly [{
    readonly name: "format";
    readonly command: "bun prettier . --write";
}, {
    readonly name: "prettier:check";
    readonly command: "bun prettier . --check";
}];
