import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { print } from './print.js';
/**
 * Read and parse .gitignore from a directory
 * @param directory - Directory containing .gitignore
 * @returns Array of existing patterns or null if not found
 */
export const readGitignore = (directory) => {
    const gitignorePath = join(directory, '.gitignore');
    if (!existsSync(gitignorePath)) {
        return null;
    }
    try {
        const content = readFileSync(gitignorePath, 'utf-8');
        return content.split('\n').map((line) => line.trim());
    }
    catch (error) {
        print(`Failed to read .gitignore: ${error instanceof Error ? error.message : String(error)}`, { type: 'error' });
        return null;
    }
};
/**
 * Write .gitignore to a directory
 * @param directory - Directory to write .gitignore to
 * @param lines - Array of lines to write (patterns, comments, empty lines)
 * @returns Result of the operation
 */
export const writeGitignore = (directory, lines) => {
    const gitignorePath = join(directory, '.gitignore');
    try {
        const content = `${lines.join('\n')}\n`;
        writeFileSync(gitignorePath, content, 'utf-8');
        return {
            success: true,
            message: '.gitignore updated successfully',
            addedPatterns: lines.filter((line) => line.length > 0 && !line.startsWith('#')),
            skippedPatterns: [],
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to write .gitignore: ${error instanceof Error ? error.message : String(error)}`,
            addedPatterns: [],
            skippedPatterns: [],
        };
    }
};
/**
 * Add new patterns to .gitignore without duplicates
 * @param directory - Directory containing .gitignore
 * @param newPatterns - Array of new patterns to add
 * @returns Result of the operation
 */
export const addGitignorePatterns = (directory, newPatterns) => {
    const existingLines = readGitignore(directory) || [];
    // Extract only the actual patterns (non-comment, non-empty lines)
    const existingPatterns = existingLines.filter((line) => line.length > 0 && !line.startsWith('#'));
    // Find patterns that don't already exist
    const patternsToAdd = newPatterns.filter((pattern) => !existingPatterns.includes(pattern));
    const patternsToSkip = newPatterns.filter((pattern) => existingPatterns.includes(pattern));
    // If no new patterns to add, return early
    if (patternsToAdd.length === 0) {
        return {
            success: true,
            message: 'All patterns already exist in .gitignore',
            addedPatterns: [],
            skippedPatterns: patternsToSkip,
        };
    }
    // Combine existing lines with new patterns
    const allLines = [...existingLines, ...patternsToAdd];
    // Write updated .gitignore
    const writeResult = writeGitignore(directory, allLines);
    if (!writeResult.success) {
        return writeResult;
    }
    return {
        success: true,
        message: 'Added new patterns to .gitignore',
        addedPatterns: patternsToAdd,
        skippedPatterns: patternsToSkip,
    };
};
//# sourceMappingURL=gitignoreUtils.js.map