import { join } from 'path/posix';
import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';
/**
 * Function to copy Prettier config
 */
export const copyPrettierConfig = () => {
    const targetPath = join(process.cwd(), '.prettierrc');
    // Path to config files in the dist directory
    const sourcePath = join(__dirname, '..', '..', 'configs', 'prettier', '.prettierrc');
    // Copy Prettier config, overwriting any existing file
    try {
        fileActions.copy(sourcePath, targetPath);
    }
    catch (error) {
        fileActions.copyError(error, targetPath);
    }
};
//# sourceMappingURL=copyPrettierConfig.js.map