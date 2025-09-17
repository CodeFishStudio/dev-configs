import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';
import { print } from '../utils/print.js';

import type { ProjectType } from '../../types/index.js';

type RulesDirectory = {
    directory: string;
    projects: ProjectType[] | 'all';
};

const ruleDirectories: RulesDirectory[] = [
    { directory: 'universal', projects: 'all' },
    { directory: 'react', projects: ['reactNext', 'reactVite', 'reactNative'] },
];

/**
 * Helper function to check if a project type should get rules from a directory
 */
const shouldCopyDirectory = (projectType: ProjectType, directory: RulesDirectory): boolean => {
    return directory.projects === 'all' || directory.projects.includes(projectType);
};

/**
 * Function to copy all files from a source directory to target directory
 */
const copyDirectoryFiles = (
    sourceDir: string,
    targetDir: string
): { copied: number; skipped: number } => {
    if (!existsSync(sourceDir)) {
        print(`Source directory not found: ${sourceDir}`, { indent: 1, type: 'error' });
        return { copied: 0, skipped: 0 };
    }

    const files = readdirSync(sourceDir);
    let copied = 0;
    let skipped = 0;

    for (const file of files) {
        const sourcePath = join(sourceDir, file);
        const targetPath = join(targetDir, file);

        // Skip directories, only copy files
        if (statSync(sourcePath).isDirectory()) {
            continue;
        }

        // Skip if file already exists
        if (fileActions.skipIfExistsSilent(targetPath)) {
            skipped++;
            continue;
        }

        // Copy the file
        fileActions.copySilent(sourcePath, targetPath);
        copied++;
    }

    return { copied, skipped };
};

/**
 * Function to copy Cursor rules files to .cursor/rules/ directory
 */
export const copyCursorRules = (projectType: ProjectType): void => {
    const targetDir = join(process.cwd(), '.cursor', 'rules');
    const rulesSourceDir = join(__dirname, '..', '..', 'configs', 'editors', 'rules');

    try {
        // Create .cursor/rules directory if it doesn't exist
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        let totalCopied = 0;
        let totalSkipped = 0;

        // Loop through each rule directory and copy files if applicable
        for (const ruleDir of ruleDirectories) {
            if (shouldCopyDirectory(projectType, ruleDir)) {
                const sourceDir = join(rulesSourceDir, ruleDir.directory);
                const { copied, skipped } = copyDirectoryFiles(sourceDir, targetDir);
                totalCopied += copied;
                totalSkipped += skipped;
            }
        }

        // Report summary
        if (totalSkipped > 0) {
            print(`Skipped copying ${totalSkipped} Cursor rule${totalSkipped === 1 ? '' : 's'}`, {
                indent: 1,
                type: 'skipped',
            });
        }
        if (totalCopied > 0) {
            print(`Copied ${totalCopied} Cursor rule${totalCopied === 1 ? '' : 's'}`, {
                indent: 1,
                type: 'success',
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        print(`Failed to copy Cursor rules: ${errorMessage}`, { indent: 1, type: 'error' });
    }
};
