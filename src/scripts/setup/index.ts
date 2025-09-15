#!/usr/bin/env node

import { existsSync } from 'fs';
import { join } from 'path';

import { addGitignoreForConfigType } from './addGitignoreForConfigType.js';
import { addScriptsForConfigType } from './addScriptsForConfigType.js';
import { copyPrettierConfig } from './copyPrettierConfig.js';
import { copyTypeScriptConfig } from './copyTypeScriptConfig.js';
import { createESLintConfig } from './createESLintConfig.js';
import { installDependencies } from './installDependencies.js';
import { configTypeOptions, projectTypeOptions } from './options.js';
import { Icons } from '../utils/enums.js';
import { promptMultipleChoice } from '../utils/promptMultipleChoice.js';
import { promptSingleChoice } from '../utils/promptSingleChoice.js';

import type { ConfigType } from '../../types/index.js';

/**
 * Main execution
 */
const main = async (): Promise<void> => {
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
    const selectedOptions = await promptMultipleChoice(
        'Select configs to install',
        configTypeOptions
    );

    // Separate config types from scripts option
    const selectedConfigs = selectedOptions.filter(
        (option): option is ConfigType => option !== 'scripts'
    );
    const addScripts = selectedOptions.includes('scripts');

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

        // Add gitignore patterns for this config type
        await addGitignoreForConfigType(configType);

        // Add scripts for this config type if scripts are requested
        if (addScripts) {
            await addScriptsForConfigType(configType);
        }
    }

    console.log('\n⚡️ Project setup complete!\n');
};

main().catch(console.error);
