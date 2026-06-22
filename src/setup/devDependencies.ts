import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { dependencies as expoEslintDependencies } from '../configs/eslint/expo.dependencies.js';
import { dependencies as nodeEslintDependencies } from '../configs/eslint/node.dependencies.js';
import { dependencies as reactEslintDependencies } from '../configs/eslint/react.dependencies.js';
import { dependencies as tanstackStartEslintDependencies } from '../configs/eslint/tanstackStart.dependencies.js';
import { dependencies as viteEslintDependencies } from '../configs/eslint/vite.dependencies.js';
import {
    prettierDependencies,
    prettierTailwindDependencies,
    usesTailwindCss,
} from '../configs/prettier/dependencies.js';
import { typescriptDependencies } from '../configs/typescript/dependencies.js';
import { runShellCommand } from '../utils/runShellCommand.js';
import type { ConfigType, PackageManager, ProjectType } from '../types/index.js';

const execAsync = promisify(exec);

type ConfigDependencies = Record<string, string>;

const DEFAULT_DEV_TOOL_CONFIGS: ConfigType[] = ['eslint', 'prettier', 'typescript'];

const getESLintDependencies = (projectType: ProjectType): ConfigDependencies => {
    switch (projectType) {
        case 'node':
            return { ...nodeEslintDependencies };
        case 'nextjs':
            return { ...reactEslintDependencies };
        case 'tanstackStart':
            return { ...tanstackStartEslintDependencies };
        case 'vite':
            return { ...viteEslintDependencies };
        case 'expo':
            return { ...expoEslintDependencies };
        default:
            return {};
    }
};

const getDependencies = (
    configType: ConfigType,
    projectType: ProjectType
): ConfigDependencies => {
    switch (configType) {
        case 'prettier':
            if (usesTailwindCss(projectType)) {
                return { ...prettierDependencies, ...prettierTailwindDependencies };
            }

            return { ...prettierDependencies };
        case 'typescript':
            return { ...typescriptDependencies };
        case 'eslint':
            return getESLintDependencies(projectType);
        default:
            return {};
    }
};

const resolveDevToolDependencies = (
    projectType: ProjectType,
    configTypes: ConfigType[]
): ConfigDependencies => {
    let output: ConfigDependencies = {};

    for (const configType of configTypes) {
        const deps = getDependencies(configType, projectType);
        output = { ...output, ...deps };
    }

    return output;
};

const formatDevInstallCommand = (
    deps: ConfigDependencies,
    packageManager: PackageManager
): string => {
    const depsList = Object.entries(deps)
        .map(([name, version]) => `"${name}@${version}"`)
        .join(' ');

    switch (packageManager) {
        case 'bun':
            return `bun add -d ${depsList}`;
        case 'pnpm':
            return `pnpm add --save-dev ${depsList}`;
        case 'yarn':
            return `yarn add --dev ${depsList}`;
        default:
            return `npm install --save-dev ${depsList}`;
    }
};

export interface InstallDevDependenciesOptions {
    projectType: ProjectType;
    cwd: string;
    packageManager: PackageManager;
    configTypes?: ConfigType[];
    onOutputLine?: (line: string) => void;
}

/**
 * Install devDependencies for the given project type in the target directory.
 */
export const installDevDependencies = async (
    options: InstallDevDependenciesOptions
): Promise<void> => {
    const {
        projectType,
        cwd,
        packageManager,
        configTypes = DEFAULT_DEV_TOOL_CONFIGS,
        onOutputLine,
    } = options;

    const deps = resolveDevToolDependencies(projectType, configTypes);

    if (Object.keys(deps).length === 0) {
        return;
    }

    const installCommand = formatDevInstallCommand(deps, packageManager);

    if (onOutputLine) {
        await runShellCommand({ command: installCommand, cwd, onOutputLine });
        return;
    }

    await execAsync(installCommand, { cwd });
};
