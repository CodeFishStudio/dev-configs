import { writeFileSync } from 'node:fs';
import { join } from 'path/posix';
import { prettierRcFileTemplate } from '../../configs/prettier/template.js';
import { fileActions } from '../utils/fileActions.js';
import type { ProjectType } from '../../types/index.js';

/**
 * Function to copy Prettier config
 */
export const copyPrettierConfig = (projectType: ProjectType): void => {
    const targetPath = join(process.cwd(), '.prettierrc');

    // Copy Prettier config, overwriting any existing file
    try {
        writeFileSync(targetPath, prettierRcFileTemplate(projectType));
    } catch (error) {
        fileActions.copyError(error, targetPath);
    }
};
