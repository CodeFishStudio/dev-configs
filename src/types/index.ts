export type ProjectType = 'node' | 'react' | 'reactNative';
export type ConfigType = 'eslint' | 'prettier' | 'typescript';

export type SelectOption<T> = {
    label: string;
    value: T;
};

export type PackageManager = 'pnpm' | 'npm' | 'yarn';

export interface PackageJsonScriptDefinition {
    name: string;
    command: string;
}
