// Type declarations for packages that don't have TypeScript support

declare module '@eslint/compat' {
    export function fixupPluginRules(rules: any): any;
}

declare module 'eslint-plugin-react-native' {
    const plugin: {
        rules: Record<string, any>;
    };
    export default plugin;
}
