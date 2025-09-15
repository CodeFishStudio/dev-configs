import { execSync } from 'child_process';
import readline from 'readline';
import { configTypeOptions } from './options.js';
import { dependencies as nodeDependencies } from '../../configs/eslint/node.config.js';
import { dependencies as reactDependencies } from '../../configs/eslint/react.config.js';
import { dependencies as reactNativeDependencies } from '../../configs/eslint/reactNative.config.js';
import { prettierDependencies } from '../../configs/prettier/dependencies.js';
import { typescriptDependencies } from '../../configs/typescript/dependencies.js';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { TextStyles, Icons } from '../utils/enums.js';
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
};
/**
 * Helper function to get the display label for a config type
 */
const getConfigTypeLabel = (configType) => {
    const option = configTypeOptions.find((opt) => opt.value === configType);
    return option?.label || configType;
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
    const configLabel = getConfigTypeLabel(configType);
    if (!requiredDeps || Object.keys(requiredDeps).length === 0) {
        console.log(`\n${TextStyles.BOLD}${configLabel}${TextStyles.RESET}`);
        console.log(`${CLI_PROGRESS_ITEM_INDENT}${Icons.WARNING} No dependencies required`);
        return;
    }
    console.log(`\n${TextStyles.BOLD}${configLabel}${TextStyles.RESET}`);
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