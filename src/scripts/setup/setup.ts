#!/usr/bin/env node

import { existsSync } from 'fs';
import { join } from 'path';

import { addGitignores } from './addGitignores.js';
import { addPackageJsonScripts } from './addPackageJsonScripts.js';
import { copyEditorConfig } from './copyEditorConfig.js';
import { copyPrettierConfig } from './copyPrettierConfig.js';
import { copyTypeScriptConfig } from './copyTypeScriptConfig.js';
import { createESLintConfig } from './createESLintConfig.js';
import { installDependencies } from './installDependencies.js';
import { configTypeOptions, projectTypeOptions } from './options.js';
import { ConfigType } from '../../types/index.js';
import { Icons, TextStyles } from '../utils/enums.js';
import { promptMultipleChoice } from '../utils/promptMultipleChoice.js';
import { promptSingleChoice } from '../utils/promptSingleChoice.js';

/**
 * Helper function to get the display label for a config type
 */
const getConfigTypeLabel = (configType: ConfigType): string => {
    const option = configTypeOptions.find((opt) => opt.value === configType);
    return option?.label || configType;
};

/**
 * Main execution
 */
export const setup = async (): Promise<void> => {
    // Check if we're in a project directory
    const projectPackageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(projectPackageJsonPath)) {
        console.error(
            `${Icons.ERROR} No package.json found in current directory. Please run this command from your project root.`
        );
        process.exit(1);
    }

    // Prompt for project type
    const projectType = await promptSingleChoice('Select project type', projectTypeOptions);

    // Prompt for config types
    const selectedConfigs = await promptMultipleChoice(
        'Select configs to install',
        configTypeOptions
    );

    // Process each selected config
    for (const configType of selectedConfigs) {
        const configLabel = getConfigTypeLabel(configType);
        console.log(`\n${TextStyles.BOLD}${configLabel}${TextStyles.RESET}`);

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
            case 'editor':
                copyEditorConfig();
                break;
        }

        // Add gitignore patterns for this config type
        await addGitignores(configType);

        // Add scripts for this config type
        await addPackageJsonScripts(configType);
    }

    console.log('\n⚡️ Project setup complete!\n');
};
