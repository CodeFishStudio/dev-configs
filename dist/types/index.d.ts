export type ProjectType = 'expo' | 'tanstack-start' | 'nextjs' | 'vite' | 'node';
export type ConfigType = 'eslint' | 'prettier' | 'typescript' | 'cursorSettings' | 'agentRulesAndSkills';
export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';
export interface PackageJsonScriptDefinition {
    name: string;
    command: string;
}
