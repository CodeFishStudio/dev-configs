import { execSync } from 'child_process';
import readline from 'readline';

import { dependencies as nodeDependencies } from '../../configs/eslint/node.config.js';
import { dependencies as reactNativeDependencies } from '../../configs/eslint/reactNative.config.js';
import { dependencies as reactNextDependencies } from '../../configs/eslint/reactNext.config.js';
import { dependencies as reactViteDependencies } from '../../configs/eslint/reactVite.config.js';
import { prettierDependencies } from '../../configs/prettier/dependencies.js';
import { typescriptDependencies } from '../../configs/typescript/dependencies.js';
import { getPackageManager } from '../utils/getPackageManager.js';
import { print } from '../utils/print.js';

import type { ConfigType, ProjectType } from '../../types/index.js';

interface ConfigDependencies {
    [key: string]: string;
}

// Map project types to their ESLint dependencies
const lintConfigDependencies: Record<ProjectType, ConfigDependencies> = {
    node: nodeDependencies,
    reactNext: reactNextDependencies,
    reactVite: reactViteDependencies,
    reactNative: reactNativeDependencies,
};

// Map config types to their dependencies
const configDependencies: Record<ConfigType, (projectType: ProjectType) => ConfigDependencies> = {
    eslint: (projectType) => lintConfigDependencies[projectType],
    prettier: () => prettierDependencies,
    typescript: () => typescriptDependencies,
    editor: () => ({}), // No dependencies required for editor config
};

/**
 * Helper function to clear the current line and move cursor to beginning
 */
const clearCurrentLine = (): void => {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
};

/**
 * Generic function to install dependencies for a config type
 */
export const installDependencies = async (
    configType: ConfigType,
    projectType: ProjectType
): Promise<void> => {
    let requiredDeps: ConfigDependencies;

    if (configType === 'eslint' && projectType) {
        requiredDeps = lintConfigDependencies[projectType];
    } else {
        requiredDeps = configDependencies[configType](projectType);
    }

    if (!requiredDeps || Object.keys(requiredDeps).length === 0) {
        return;
    }

    print(`⏳ Installing dependencies...`, { indent: 1 });

    // Build install command with all dependencies
    const depsList = Object.entries(requiredDeps)
        .map(([name, version]) => `"${name}@${version}"`)
        .join(' ');

    let installCommand: string;
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        clearCurrentLine();
        print(`Failed to install dependencies: ${errorMessage}`, { indent: 1, type: 'error' });
    }
};
