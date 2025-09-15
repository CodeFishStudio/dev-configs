import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { handleFileOperation } from './handleFileOperation.js';
import { __dirname, CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { Icons } from '../utils/enums.js';
/**
 * Recursively copy directory contents
 */
const copyDirectoryRecursive = (source, target) => {
    const items = readdirSync(source);
    for (const item of items) {
        const sourcePath = join(source, item);
        const targetPath = join(target, item);
        if (statSync(sourcePath).isDirectory()) {
            // Create target directory if it doesn't exist
            if (!existsSync(targetPath)) {
                mkdirSync(targetPath, { recursive: true });
            }
            // Recursively copy subdirectory
            copyDirectoryRecursive(sourcePath, targetPath);
        }
        else {
            handleFileOperation(targetPath, () => copyFileSync(sourcePath, targetPath), (fileName) => `Copied ${fileName}`, (fileName) => `Failed to copy ${fileName}`);
        }
    }
};
/**
 * Function to copy editor configuration files
 */
export const copyEditorConfig = () => {
    const sourceDir = join(__dirname, '..', '..', 'configs', 'editors', 'settings');
    const targetDir = process.cwd();
    try {
        // Debug: Log the constructed path
        console.log(`Looking for editor settings at: ${sourceDir}`);
        console.log(`Directory exists: ${existsSync(sourceDir)}`);
        // Check if source directory exists
        if (!existsSync(sourceDir)) {
            console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Editor settings directory not found at: ${sourceDir}`);
            return;
        }
        // Copy all files and directories recursively
        copyDirectoryRecursive(sourceDir, targetDir);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Failed to copy editor configuration: ${errorMessage}`);
    }
};
//# sourceMappingURL=copyEditorConfig.js.map