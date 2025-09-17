import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';
import { print } from '../utils/print.js';
/**
 * Recursively copy directory contents, overwriting any existing files
 */
const copyDirectoryRecursive = (source, target) => {
    const items = readdirSync(source);
    for (const item of items) {
        const sourcePath = join(source, item);
        const targetPath = join(target, item);
        // Handle directory
        if (statSync(sourcePath).isDirectory()) {
            // Create target directory if it doesn't exist
            if (!existsSync(targetPath)) {
                mkdirSync(targetPath, { recursive: true });
            }
            // Recursively copy subdirectory
            copyDirectoryRecursive(sourcePath, targetPath);
            continue;
        }
        // Handle file - copy silently without individual logging
        try {
            copyFileSync(sourcePath, targetPath);
        }
        catch (error) {
            const fileName = fileActions.getFileName(targetPath);
            const errorMsg = error instanceof Error ? error.message : String(error);
            print(`Failed to copy ${fileName}: ${errorMsg}`, { indent: 1, type: 'error' });
            throw error; // Re-throw to be caught by parent function
        }
    }
};
/**
 * Function to copy editor settings files
 */
export const copyEditorSettings = () => {
    const sourceDir = join(__dirname, '..', '..', 'configs', 'editors', 'settings');
    const targetDir = process.cwd();
    try {
        // Check if source directory exists
        if (!existsSync(sourceDir)) {
            print('Editor settings directory not found', { indent: 1, type: 'error' });
            return;
        }
        // Copy all files and directories recursively
        copyDirectoryRecursive(sourceDir, targetDir);
        // Show single success message
        print('Copied editor settings', { indent: 1, type: 'success' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        print(`Failed to copy editor settings: ${errorMessage}`, { indent: 1, type: 'error' });
    }
};
//# sourceMappingURL=copyEditorSettings.js.map