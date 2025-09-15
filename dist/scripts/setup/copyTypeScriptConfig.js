import { copyFileSync } from 'fs';
import { join } from 'path/posix';
import { handleFileOperation } from './handleFileOperation.js';
import { __dirname } from '../utils/constants.js';
/**
 * Function to copy TypeScript config
 */
export const copyTypeScriptConfig = (projectType) => {
    const configFileName = `${projectType}.config.json`;
    const sourcePath = join(__dirname, '..', '..', 'configs', 'typescript', configFileName);
    const targetPath = join(process.cwd(), 'tsconfig.json');
    handleFileOperation(targetPath, () => copyFileSync(sourcePath, targetPath), (fileName) => `Copied ${fileName}`, (fileName) => `Failed to copy ${fileName}`);
};
//# sourceMappingURL=copyTypeScriptConfig.js.map