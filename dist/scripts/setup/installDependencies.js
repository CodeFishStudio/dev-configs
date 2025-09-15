import { execSync } from 'child_process';
import readline from 'readline';
import { dependencies as nodeDependencies } from '../../configs/eslint/node.config.js';
import { dependencies as reactDependencies } from '../../configs/eslint/react.config.js';
import { dependencies as reactNativeDependencies } from '../../configs/eslint/reactNative.config.js';
import { prettierDependencies } from '../../configs/prettier/dependencies.js';
import { typescriptDependencies } from '../../configs/typescript/dependencies.js';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { Icons } from '../utils/enums.js';
import { getPackageManager } from '../utils/getPackageManager.js';
// Map project types to their ESLint dependencies
const lintConfigDependencies = {
    node: nodeDependencies,
    react: reactDependencies,
    reactNative: reactNativeDependencies,
};
// Map config types to their dependencies
const configDependencies = {
    eslint: (projectType) => lintConfigDependencies[projectType],
    prettier: () => prettierDependencies,
    typescript: () => typescriptDependencies,
    editor: () => ({}), // No dependencies required for editor config
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
    if (configType === 'eslint' && projectType) {
        requiredDeps = lintConfigDependencies[projectType];
    }
    else {
        requiredDeps = configDependencies[configType](projectType);
    }
    if (!requiredDeps || Object.keys(requiredDeps).length === 0) {
        return;
    }
    console.log(`${CLI_PROGRESS_ITEM_INDENT}⏳ Installing dependencies...`);
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
        console.log(`${CLI_PROGRESS_ITEM_INDENT}${Icons.SUCCESS} Installed dependencies`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        clearCurrentLine();
        console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Failed to install dependencies: ${errorMessage}`);
    }
};
//# sourceMappingURL=installDependencies.js.map