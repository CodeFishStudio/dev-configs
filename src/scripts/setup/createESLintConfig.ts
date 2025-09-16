import { join } from 'path/posix';

import { eslintConfigFileTemplate } from '../../configs/eslint/template.js';
import { fileActions } from '../utils/fileActions.js';

import type { ProjectType } from '../../types/index.js';

/**
 * Function to create ESLint config file
 */
export const createESLintConfig = (projectType: ProjectType): void => {
    // Using .mjs extension to prevent having to set "type": "module" in package.json
    const targetPath = join(process.cwd(), 'eslint.config.mjs');

    // Create ESLint config, overwriting any existing file
    try {
        fileActions.create(targetPath, eslintConfigFileTemplate(projectType));
    } catch (error) {
        fileActions.createError(error, targetPath);
    }
};
