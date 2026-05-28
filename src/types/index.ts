export type ProjectType = 'node' | 'reactNative' | 'reactNext' | 'reactTanStackStart' | 'reactVite';
export type ConfigType =
    | 'eslint'
    | 'prettier'
    | 'typescript'
    | 'cursorSettings'
    | 'agentRulesAndSkills';

export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

export interface PackageJsonScriptDefinition {
    name: string;
    command: string;
}
