#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dependencies as nodeDependencies } from '../../configs/eslint/node.js';
import { dependencies as reactDependencies } from '../../configs/eslint/react.js';
import { dependencies as reactNativeDependencies } from '../../configs/eslint/reactNative.js';
import { eslintConfigFileTemplate } from '../../configs/eslint/template.js';
import { prettierDependencies } from '../../configs/prettier/dependencies.js';
import { typescriptDependencies } from '../../configs/typescript/dependencies.js';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { TextStyles } from '../utils/enums.js';
import { getPackageManager } from '../utils/getPackageManager.js';
import { promptMultipleChoice } from '../utils/promptMultipleChoice.js';
import { promptSingleChoice } from '../utils/promptSingleChoice.js';
// ES module equivalent of __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));
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
const projectTypeOptions = [
    { label: 'React', value: 'react' },
    { label: 'React Native (with Expo)', value: 'reactNative' },
    { label: 'Node', value: 'node' },
];
const configTypeOptions = [
    { label: 'ESLint', value: 'eslint' },
    { label: 'Prettier', value: 'prettier' },
    { label: 'TypeScript', value: 'typescript' },
];
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
const Icons = {
    SUCCESS: `${TextStyles.GREEN}✔${TextStyles.RESET}`,
    ERROR: `${TextStyles.RED}✖${TextStyles.RESET}`,
    WARNING: `${TextStyles.YELLOW}◇${TextStyles.RESET}`,
};
/**
 * Helper function to handle file operations with consistent error handling and output
 */
const handleFileOperation = (targetPath, operation, successMessage, errorMessage) => {
    const fileName = targetPath.split('/').pop() || targetPath;
    if (existsSync(targetPath)) {
        console.log(`${CLI_PROGRESS_ITEM_INDENT}${Icons.WARNING} ${fileName} already exists, skipping...`);
        return;
    }
    try {
        operation();
        console.log(`${CLI_PROGRESS_ITEM_INDENT}${Icons.SUCCESS} ${successMessage(fileName)}`);
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} ${errorMessage(fileName)}:`, errorMsg);
    }
};
/**
 * Function to copy config files to project root
 */
const copyConfigFile = (sourcePath, targetPath) => {
    handleFileOperation(targetPath, () => copyFileSync(sourcePath, targetPath), (fileName) => `Copied ${fileName}`, (fileName) => `Failed to copy ${fileName}`);
};
/**
 * Function to create ESLint config file
 */
const createESLintConfig = (projectType) => {
    const targetPath = join(process.cwd(), 'eslint.config.js');
    handleFileOperation(targetPath, () => {
        const configContent = eslintConfigFileTemplate(projectType);
        writeFileSync(targetPath, configContent);
    }, (fileName) => `Created ${fileName}`, (fileName) => `Failed to create ${fileName}`);
};
/**
 * Generic function to install dependencies for a config type
 */
const installDependencies = async (configType, projectType) => {
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
/**
 * Function to copy Prettier config
 */
const copyPrettierConfig = () => {
    const targetPath = join(process.cwd(), '.prettierrc');
    // Path to config files in the dist directory
    const sourcePath = join(__dirname, '..', '..', 'configs', 'prettier', '.prettierrc');
    copyConfigFile(sourcePath, targetPath);
};
/**
 * Function to copy TypeScript config
 */
const copyTypeScriptConfig = (projectType) => {
    const configFileName = `${projectType}.json`;
    const sourcePath = join(__dirname, '..', '..', 'configs', 'typescript', configFileName);
    const targetPath = join(process.cwd(), 'tsconfig.json');
    copyConfigFile(sourcePath, targetPath);
};
/**
 * Main execution
 */
const main = async () => {
    // Check if we're in a project directory
    const projectPackageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(projectPackageJsonPath)) {
        console.error(`${Icons.ERROR} No package.json found in current directory. Please run this command from your project root.`);
        process.exit(1);
    }
    // Prompt for project type
    const projectType = await promptSingleChoice('Choose project type', projectTypeOptions);
    // Prompt for config types
    const selectedConfigs = await promptMultipleChoice('Select configs to initialize', configTypeOptions);
    // Process each selected config
    for (const configType of selectedConfigs) {
        // Install dependencies for this config type
        await installDependencies(configType, projectType);
        // Copy/create config file for this config type
        switch (configType) {
            case 'eslint':
                createESLintConfig(projectType);
                break;
            case 'prettier':
                copyPrettierConfig();
                break;
            case 'typescript':
                copyTypeScriptConfig(projectType);
                break;
        }
    }
    console.log('\n🚀 Project setup complete!\n');
};
main().catch(console.error);
//# sourceMappingURL=index.js.map