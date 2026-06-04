import { cancel, group, intro, log, multiselect, outro, select } from '@clack/prompts';
import { existsSync } from 'fs';
import { styleText } from 'node:util';
import { join } from 'path';
import { copyPrettierConfig } from './copyPrettierConfig.js';
import { copyTypeScriptConfig } from './copyTypeScriptConfig.js';
import { createESLintConfig } from './createESLintConfig.js';
import { installDependencies } from './installDependencies.js';
import { configTypeOptions, projectTypeOptions } from './options.js';
import { addPackageJsonScripts } from '../../setup/packageJsonScripts.js';
import { getPackageManager } from '../utils/getPackageManager.js';
/**
 * Main execution
 */
export const setup = async () => {
    // Check if we're in a project directory
    const projectPackageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(projectPackageJsonPath)) {
        log.error('No package.json found in current directory. Please run this command from your project root.');
        process.exit(1);
    }
    intro(styleText(['bgCyan', 'black'], ' cfs-setup '));
    // Prompt for project type and config types
    const { projectType, selectedConfigs } = await group({
        projectType: () => select({
            message: 'Select project type',
            options: projectTypeOptions,
        }),
        selectedConfigs: () => multiselect({
            message: `Select configs to install${styleText(['gray'], ' (space to toggle)')}`,
            options: configTypeOptions,
            initialValues: configTypeOptions.map((option) => option.value),
            required: true,
        }),
    }, {
        onCancel: () => {
            cancel('Setup cancelled.');
            process.exit(0);
        },
    });
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
    await addPackageJsonScripts({
        cwd: process.cwd(),
        packageManager: getPackageManager(),
        configTypes: selectedConfigs,
    });
    outro('⚡️ Project setup complete!');
};
//# sourceMappingURL=setup.js.map