import { join } from 'path/posix';

import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';

import type { ProjectType } from '../../types/index.js';

/**
 * Function to copy TypeScript config
 */
export const copyTypeScriptConfig = (projectType: ProjectType): void => {
    const configFileName = `${projectType}.config.json`;
    const sourcePath = join(__dirname, '..', '..', 'configs', 'typescript', configFileName);
    const targetPath = join(process.cwd(), 'tsconfig.json');

    if (fileActions.skipIfExists(targetPath)) return;

    try {
        fileActions.copy(sourcePath, targetPath);
    } catch (error) {
        fileActions.copyError(error, targetPath);
    }
};
