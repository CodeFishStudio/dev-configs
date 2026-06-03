import { log, spinner } from '@clack/prompts';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { configTypeOptions } from './options.js';
import { getPackageManager } from '../utils/getPackageManager.js';
const execAsync = promisify(exec);
/**
 * Dynamically load ESLint dependencies to avoid loading ESLint configs before dependencies are installed
 */
const getESLintDependencies = async (projectType) => {
    switch (projectType) {
        case 'node': {
            const { dependencies } = await import('../../configs/eslint/node.dependencies.js');
            return dependencies;
        }
        case 'nextjs': {
            const { dependencies } = await import('../../configs/eslint/react.dependencies.js');
            return dependencies;
        }
        case 'tanstackStart': {
            const { dependencies } = await import('../../configs/eslint/tanstackStart.dependencies.js');
            return dependencies;
        }
        case 'vite': {
            const { dependencies } = await import('../../configs/eslint/vite.dependencies.js');
            return dependencies;
        }
        case 'expo': {
            const { dependencies } = await import('../../configs/eslint/expo.dependencies.js');
            return dependencies;
        }
        default:
            return {};
    }
};
/**
 * Dynamically load other config dependencies
 */
const getConfigDependencies = async (configType) => {
    switch (configType) {
        case 'prettier': {
            const { prettierDependencies } = await import('../../configs/prettier/dependencies.js');
            return prettierDependencies;
        }
        case 'typescript': {
            const { typescriptDependencies } = await import('../../configs/typescript/dependencies.js');
            return typescriptDependencies;
        }
        case 'cursorSettings':
        case 'agentRulesAndSkills':
            return {};
        default:
            return {};
    }
};
/**
 * Helper function to get the display label for a config type
 */
const getConfigTypeLabel = (configType) => {
    const option = configTypeOptions.find((opt) => opt.value === configType);
    return option?.label || configType;
};
/**
 * Generic function to install dependencies for a config type
 */
export const installDependencies = async (configType, projectType) => {
    const configLabel = getConfigTypeLabel(configType);
    let requiredDeps;
    if (configType === 'eslint') {
        requiredDeps = await getESLintDependencies(projectType);
    }
    else {
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
    let installCommand;
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        s.error(`Failed to install ${configLabel} dependencies: ${errorMessage}`);
    }
};
//# sourceMappingURL=installDependencies.js.map