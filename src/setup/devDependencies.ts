import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import type { ConfigType, PackageManager, ProjectType } from '../types/index.js';

const execAsync = promisify(exec);

type ConfigDependencies = Record<string, string>;

const DEFAULT_DEV_TOOL_CONFIGS: ConfigType[] = ['eslint', 'prettier', 'typescript'];

const getESLintDependencies = async (projectType: ProjectType): Promise<ConfigDependencies> => {
    switch (projectType) {
        case 'node': {
            const { dependencies } = await import('../configs/eslint/node.dependencies.js');
            return { ...dependencies };
        }
        case 'nextjs': {
            const { dependencies } = await import('../configs/eslint/react.dependencies.js');
            return { ...dependencies };
        }
        case 'tanstackStart': {
            const { dependencies } = await import(
                '../configs/eslint/tanstackStart.dependencies.js'
            );
            return { ...dependencies };
        }
        case 'vite': {
            const { dependencies } = await import('../configs/eslint/vite.dependencies.js');
            return { ...dependencies };
        }
        case 'expo': {
            const { dependencies } = await import('../configs/eslint/expo.dependencies.js');
            return { ...dependencies };
        }
        default:
            return {};
    }
};

const getDependencies = async (
    configType: ConfigType,
    projectType: ProjectType
): Promise<ConfigDependencies> => {
    switch (configType) {
        case 'prettier': {
            const { prettierDependencies } = await import('../configs/prettier/dependencies.js');
            return { ...prettierDependencies };
        }
        case 'typescript': {
            const { typescriptDependencies } = await import(
                '../configs/typescript/dependencies.js'
            );
            return { ...typescriptDependencies };
        }
        case 'eslint': {
            return getESLintDependencies(projectType);
        }
        case 'cursorSettings':
        case 'agentRulesAndSkills':
        default:
            return {};
    }
};

const resolveDevToolDependencies = async (
    projectType: ProjectType,
    configTypes: ConfigType[]
): Promise<ConfigDependencies> => {
    let output: ConfigDependencies = {};

    for (const configType of configTypes) {
        const deps = await getDependencies(configType, projectType);
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

/**
 * Install devDependencies for the given project type in the target directory.
 */
export const installDevDependencies = async (options: {
    projectType: ProjectType;
    cwd: string;
    packageManager: PackageManager;
    configTypes?: ConfigType[];
}): Promise<void> => {
    const { projectType, cwd, packageManager, configTypes = DEFAULT_DEV_TOOL_CONFIGS } = options;

    const deps = await resolveDevToolDependencies(projectType, configTypes);

    if (Object.keys(deps).length === 0) {
        return;
    }

    const installCommand = formatDevInstallCommand(deps, packageManager);
    await execAsync(installCommand, { cwd });
};
