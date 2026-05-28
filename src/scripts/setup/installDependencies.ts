import { log, spinner } from '@clack/prompts';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { configTypeOptions } from './options.js';
import { getPackageManager } from '../utils/getPackageManager.js';

import type { ConfigType, ProjectType } from '../../types/index.js';

const execAsync = promisify(exec);

interface ConfigDependencies {
    [key: string]: string;
}

/**
 * Dynamically load ESLint dependencies to avoid loading ESLint configs before dependencies are installed
 */
const getESLintDependencies = async (projectType: ProjectType): Promise<ConfigDependencies> => {
    switch (projectType) {
        case 'node': {
            const { dependencies } = await import('../../configs/eslint/node.dependencies.js');
            return dependencies;
        }
        case 'reactNext': {
            const { dependencies } = await import('../../configs/eslint/react.dependencies.js');
            return dependencies;
        }
        case 'reactTanStackStart': {
            const { dependencies } = await import(
                '../../configs/eslint/reactTanStackStart.dependencies.js'
            );
            return dependencies;
        }
        case 'reactVite': {
            const { dependencies } = await import('../../configs/eslint/reactVite.dependencies.js');
            return dependencies;
        }
        case 'reactNative': {
            const { dependencies } = await import(
                '../../configs/eslint/reactNative.dependencies.js'
            );
            return dependencies;
        }
        default:
            return {};
    }
};

/**
 * Dynamically load other config dependencies
 */
const getConfigDependencies = async (configType: ConfigType): Promise<ConfigDependencies> => {
    switch (configType) {
        case 'prettier': {
            const { prettierDependencies } = await import('../../configs/prettier/dependencies.js');
            return prettierDependencies;
        }
        case 'typescript': {
            const { typescriptDependencies } = await import(
                '../../configs/typescript/dependencies.js'
            );
            return typescriptDependencies;
        }
        case 'editor':
            return {}; // No dependencies required for editor config
        default:
            return {};
    }
};

/**
 * Helper function to get the display label for a config type
 */
const getConfigTypeLabel = (configType: ConfigType): string => {
    const option = configTypeOptions.find((opt) => opt.value === configType);
    return option?.label || configType;
};

/**
 * Generic function to install dependencies for a config type
 */
export const installDependencies = async (
    configType: ConfigType,
    projectType: ProjectType
): Promise<void> => {
    const configLabel = getConfigTypeLabel(configType);

    let requiredDeps: ConfigDependencies;

    if (configType === 'eslint') {
        requiredDeps = await getESLintDependencies(projectType);
    } else {
        requiredDeps = await getConfigDependencies(configType);
    }

    if (!requiredDeps || Object.keys(requiredDeps).length === 0) {
        log.step(configLabel);
        return;
    }

    // Build install command with all dependencies
    const depsList = Object.entries(requiredDeps)
        .map(([name, version]) => `"${name}@${version}"`)
        .join(' ');

    let installCommand: string;
    switch (getPackageManager()) {
        case 'bun':
            installCommand = `bun add -d ${depsList}`;
            break;
        case 'pnpm':
            installCommand = `pnpm add --save-dev ${depsList}`;
            break;
        case 'yarn':
            installCommand = `yarn add --dev ${depsList}`;
            break;
        default:
            installCommand = `npm install --save-dev ${depsList}`;
    }

    const s = spinner();

    try {
        s.start(`Installing ${configLabel} dependencies`);
        await execAsync(installCommand, { cwd: process.cwd() });
        s.stop(configLabel);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        s.error(`Failed to install ${configLabel} dependencies: ${errorMessage}`);
    }
};
