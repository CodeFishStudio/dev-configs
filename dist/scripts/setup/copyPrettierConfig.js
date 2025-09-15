import { copyFileSync } from 'fs';
import { join } from 'path/posix';
import { handleFileOperation } from './handleFileOperation.js';
import { __dirname } from '../utils/constants.js';
/**
 * Function to copy Prettier config
 */
export const copyPrettierConfig = () => {
    const targetPath = join(process.cwd(), '.prettierrc');
    // Path to config files in the dist directory
    const sourcePath = join(__dirname, '..', '..', 'configs', 'prettier', '.prettierrc');
    handleFileOperation(targetPath, () => copyFileSync(sourcePath, targetPath), (fileName) => `Copied ${fileName}`, (fileName) => `Failed to copy ${fileName}`);
};
//# sourceMappingURL=copyPrettierConfig.js.map