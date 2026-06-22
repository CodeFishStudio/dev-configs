import { writeFileSync } from 'node:fs';
import { join } from 'path/posix';
import { prettierRcFileTemplate } from '../../configs/prettier/template.js';
import { fileActions } from '../utils/fileActions.js';
/**
 * Function to copy Prettier config
 */
export const copyPrettierConfig = (projectType) => {
    const targetPath = join(process.cwd(), '.prettierrc');
    // Copy Prettier config, overwriting any existing file
    try {
        writeFileSync(targetPath, prettierRcFileTemplate(projectType));
    }
    catch (error) {
        fileActions.copyError(error, targetPath);
    }
};
//# sourceMappingURL=copyPrettierConfig.js.map