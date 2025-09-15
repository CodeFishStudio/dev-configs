import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
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
        return content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith('#'));
    }
    catch (error) {
        console.error(`Failed to read .gitignore: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
};
/**
 * Write .gitignore to a directory
 * @param directory - Directory to write .gitignore to
 * @param patterns - Array of patterns to write
 * @returns Result of the operation
 */
export const writeGitignore = (directory, patterns) => {
    const gitignorePath = join(directory, '.gitignore');
    try {
        const content = `${patterns.join('\n')}\n`;
        writeFileSync(gitignorePath, content, 'utf-8');
        return {
            success: true,
            message: '.gitignore updated successfully',
            addedPatterns: patterns,
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
    const existingPatterns = readGitignore(directory) || [];
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
    // Combine existing and new patterns
    const allPatterns = [...existingPatterns, ...patternsToAdd];
    // Write updated .gitignore
    const writeResult = writeGitignore(directory, allPatterns);
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