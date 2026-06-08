import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { runShellCommand } from '../utils/runShellCommand.js';
const execAsync = promisify(exec);
const DEFAULT_DEV_TOOL_CONFIGS = ['eslint', 'prettier', 'typescript'];
const getESLintDependencies = async (projectType) => {
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
            const { dependencies } = await import('../configs/eslint/tanstackStart.dependencies.js');
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
const getDependencies = async (configType, projectType) => {
    switch (configType) {
        case 'prettier': {
            const { prettierDependencies } = await import('../configs/prettier/dependencies.js');
            return { ...prettierDependencies };
        }
        case 'typescript': {
            const { typescriptDependencies } = await import('../configs/typescript/dependencies.js');
            return { ...typescriptDependencies };
        }
        case 'eslint': {
            return getESLintDependencies(projectType);
        }
        default:
            return {};
    }
};
const resolveDevToolDependencies = async (projectType, configTypes) => {
    let output = {};
    for (const configType of configTypes) {
        const deps = await getDependencies(configType, projectType);
        output = { ...output, ...deps };
    }
    return output;
};
const formatDevInstallCommand = (deps, packageManager) => {
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
export const installDevDependencies = async (options) => {
    const { projectType, cwd, packageManager, configTypes = DEFAULT_DEV_TOOL_CONFIGS, onOutputLine, } = options;
    const deps = await resolveDevToolDependencies(projectType, configTypes);
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
//# sourceMappingURL=devDependencies.js.map