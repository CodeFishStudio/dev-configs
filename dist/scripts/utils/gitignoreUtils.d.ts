/**
 * Result of gitignore operations
 */
interface GitignoreResult {
    success: boolean;
    message: string;
    addedPatterns: string[];
    skippedPatterns: string[];
}
/**
 * Read and parse .gitignore from a directory
 * @param directory - Directory containing .gitignore
 * @returns Array of existing patterns or null if not found
 */
export declare const readGitignore: (directory: string) => string[] | null;
/**
 * Write .gitignore to a directory
 * @param directory - Directory to write .gitignore to
 * @param lines - Array of lines to write (patterns, comments, empty lines)
 * @returns Result of the operation
 */
export declare const writeGitignore: (directory: string, lines: string[]) => GitignoreResult;
/**
 * Add new patterns to .gitignore without duplicates
 * @param directory - Directory containing .gitignore
 * @param newPatterns - Array of new patterns to add
 * @returns Result of the operation
 */
export declare const addGitignorePatterns: (directory: string, newPatterns: string[]) => GitignoreResult;
export {};
