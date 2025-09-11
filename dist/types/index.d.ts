export type ProjectType = 'node' | 'react' | 'reactNative';
export type ConfigType = 'eslint' | 'prettier' | 'typescript';
export type SelectOption<T> = {
    label: string;
    value: T;
};
