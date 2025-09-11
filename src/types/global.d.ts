/* eslint-disable @typescript-eslint/no-explicit-any */

// Type declarations for packages that don't have TypeScript support

declare module 'eslint-plugin-react-native' {
    const plugin: {
        rules: Record<string, any>;
    };
    export default plugin;
}
