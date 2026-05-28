import { cancel, group, intro, log, multiselect, outro, select } from '@clack/prompts';
import { existsSync } from 'fs';
import { styleText } from 'node:util';
import { join } from 'path';
import { addGitignores } from './addGitignores.js';
import { addPackageJsonScripts } from './addPackageJsonScripts.js';
import { copyCursorRules } from './copyCursorRules.js';
import { copyEditorSettings } from './copyEditorSettings.js';
import { copyPrettierConfig } from './copyPrettierConfig.js';
import { copyTypeScriptConfig } from './copyTypeScriptConfig.js';
import { createESLintConfig } from './createESLintConfig.js';
import { installDependencies } from './installDependencies.js';
import { configTypeOptions, projectTypeOptions } from './options.js';
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
    const { projectType, selectedConfigs } = await await group({
        projectType: () => select({
            message: 'Select project type',
            options: projectTypeOptions,
        }),
        selectedConfigs: () => multiselect({
            message: 'Select configs to install',
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
        // log.message(styleText('cyan', configLabel), {
        //     symbol: styleText('cyan', '•'),
        // });
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
                copyEditorSettings();
                copyCursorRules(projectType);
                break;
        }
        // Add gitignore patterns for this config type
        await addGitignores(configType);
        // Add scripts for this config type
        await addPackageJsonScripts(configType);
    }
    outro('⚡️ Project setup complete!');
};
//# sourceMappingURL=setup.js.map