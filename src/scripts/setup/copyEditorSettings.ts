import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import { logStep } from './utils.js';
import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';

/**
 * Recursively copy directory contents, overwriting any existing files
 */
const copyDirectoryRecursive = (source: string, target: string): void => {
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
        } catch (error) {
            const fileName = fileActions.getFileName(targetPath);
            const errorMsg = error instanceof Error ? error.message : String(error);
            logStep(`Failed to copy ${fileName}: ${errorMsg}`, 'error');
            throw error; // Re-throw to be caught by parent function
        }
    }
};

/**
 * Function to copy editor settings files
 */
export const copyEditorSettings = (): void => {
    const sourceDir = join(__dirname, '..', '..', 'configs', 'editors', 'settings');
    const targetDir = process.cwd();

    try {
        // Check if source directory exists
        if (!existsSync(sourceDir)) {
            logStep('Editor settings directory not found', 'error');
            return;
        }

        // Copy all files and directories recursively
        copyDirectoryRecursive(sourceDir, targetDir);

        // Show single success message
        logStep('Copied editor settings', 'success');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep(`Failed to copy editor settings: ${errorMessage}`, 'error');
    }
};
