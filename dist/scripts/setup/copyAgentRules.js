import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { logStep } from './utils.js';
import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';
const ruleDirectories = [
    { directory: 'universal', projects: 'all' },
    {
        directory: 'react',
        projects: ['reactNext', 'reactTanStackStart', 'reactVite', 'reactNative'],
    },
];
/**
 * Helper function to check if a project type should get rules from a directory
 */
const shouldCopyDirectory = (projectType, directory) => {
    return directory.projects === 'all' || directory.projects.includes(projectType);
};
/**
 * Function to copy all files from a source directory to target directory
 */
const copyDirectoryFiles = (sourceDir, targetDir) => {
    if (!existsSync(sourceDir)) {
        logStep(`Source directory not found: ${sourceDir}`, 'error');
        return 0;
    }
    const files = readdirSync(sourceDir);
    let copied = 0;
    for (const file of files) {
        const sourcePath = join(sourceDir, file);
        const targetPath = join(targetDir, file);
        // Skip directories, only copy files
        if (statSync(sourcePath).isDirectory()) {
            continue;
        }
        fileActions.copySilent(sourcePath, targetPath);
        copied++;
    }
    return copied;
};
/**
 * Copy agent rule files to `.cursor/rules/`.
 * Overwrites any existing rule files at the same path; other files in the directory are left unchanged.
 */
export const copyAgentRules = (projectType) => {
    const targetDir = join(process.cwd(), '.cursor', 'rules');
    const rulesSourceDir = join(__dirname, '..', '..', 'configs', 'agents', 'rules');
    try {
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }
        let totalCopied = 0;
        for (const ruleDir of ruleDirectories) {
            if (shouldCopyDirectory(projectType, ruleDir)) {
                const sourceDir = join(rulesSourceDir, ruleDir.directory);
                totalCopied += copyDirectoryFiles(sourceDir, targetDir);
            }
        }
        if (totalCopied > 0) {
            logStep(`Installed ${totalCopied} agent rule${totalCopied === 1 ? '' : 's'}`, 'success');
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep(`Failed to copy agent rules: ${errorMessage}`, 'error');
    }
};
//# sourceMappingURL=copyAgentRules.js.map