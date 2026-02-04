export type ProjectType = 'node' | 'reactNative' | 'reactNext' | 'reactTanStackStart' | 'reactVite';
export type ConfigType = 'eslint' | 'prettier' | 'typescript' | 'editor';
export type SelectOption<T> = {
    label: string;
    value: T;
};
export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';
export interface PackageJsonScriptDefinition {
    name: string;
    command: string;
}
