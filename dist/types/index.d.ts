export type ProjectType = 'expo' | 'tanstackStart' | 'nextjs' | 'vite' | 'node';
export type ConfigType = 'eslint' | 'prettier' | 'typescript' | 'cursorSettings';
export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';
export interface PackageJsonScriptDefinition {
    name: string;
    command: string;
}
