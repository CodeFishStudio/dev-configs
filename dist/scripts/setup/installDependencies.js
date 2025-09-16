import { execSync } from 'child_process';
import readline from 'readline';
import { getPackageManager } from '../utils/getPackageManager.js';
import { print } from '../utils/print.js';
/**
 * Dynamically load ESLint dependencies to avoid loading ESLint configs before dependencies are installed
 */
const getESLintDependencies = async (projectType) => {
    switch (projectType) {
        case 'node': {
            const { dependencies } = await import('../../configs/eslint/node.dependencies.js');
            return dependencies;
        }
        case 'reactNext': {
            const { dependencies } = await import('../../configs/eslint/react.dependencies.js');
            return dependencies;
        }
        case 'reactVite': {
            const { dependencies } = await import('../../configs/eslint/reactVite.dependencies.js');
            return dependencies;
        }
        case 'reactNative': {
            const { dependencies } = await import('../../configs/eslint/reactNative.dependencies.js');
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
        case 'editor':
            return {}; // No dependencies required for editor config
        default:
            return {};
    }
};
/**
 * Helper function to clear the current line and move cursor to beginning
 */
const clearCurrentLine = () => {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
};
/**
 * Generic function to install dependencies for a config type
 */
export const installDependencies = async (configType, projectType) => {
    let requiredDeps;
    if (configType === 'eslint') {
        requiredDeps = await getESLintDependencies(projectType);
    }
    else {
        requiredDeps = await getConfigDependencies(configType);
    }
    if (!requiredDeps || Object.keys(requiredDeps).length === 0) {
        return;
    }
    print(`⏳ Installing dependencies...`, { indent: 1 });
    // Build install command with all dependencies
    const depsList = Object.entries(requiredDeps)
        .map(([name, version]) => `"${name}@${version}"`)
        .join(' ');
    let installCommand;
    switch (getPackageManager()) {
        case 'pnpm':
            installCommand = `pnpm add --save-dev ${depsList}`;
            break;
        case 'yarn':
            installCommand = `yarn add --dev ${depsList}`;
            break;
        default:
            installCommand = `npm install --save-dev ${depsList}`;
    }
    try {
        execSync(installCommand, { stdio: 'pipe' });
        clearCurrentLine();
        print(`Installed dependencies`, { indent: 1, type: 'success' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        clearCurrentLine();
        print(`Failed to install dependencies: ${errorMessage}`, { indent: 1, type: 'error' });
    }
};
//# sourceMappingURL=installDependencies.js.map