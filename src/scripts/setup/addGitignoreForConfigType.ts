import { gitignorePatterns } from '../../configs/eslint/gitignore.js';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { Icons } from '../utils/enums.js';
import { addGitignorePatterns } from '../utils/gitignoreUtils.js';

import type { ConfigType } from '../../types/index.js';

/**
 * Map of config types to their gitignore patterns
 */
const configGitignorePatterns: Record<ConfigType, readonly string[]> = {
    eslint: gitignorePatterns,
    prettier: [], // No patterns for prettier yet
    typescript: [], // No patterns for typescript yet
};

/**
 * Function to add gitignore patterns for a specific config type
 */
export const addGitignoreForConfigType = async (configType: ConfigType): Promise<void> => {
    const directory = process.cwd();

    try {
        // Get patterns for this config type
        const patternsToAdd = configGitignorePatterns[configType];

        // Skip if no patterns defined for this config type
        if (patternsToAdd.length === 0) {
            return;
        }

        // Add patterns to .gitignore
        const result = addGitignorePatterns(directory, [...patternsToAdd]);

        if (!result.success) {
            console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} ${result.message}`);
            return;
        }

        // Log added patterns
        if (result.addedPatterns.length > 0) {
            result.addedPatterns.forEach((pattern) => {
                console.log(
                    `${CLI_PROGRESS_ITEM_INDENT}${Icons.SUCCESS} Added '${pattern}' to .gitignore`
                );
            });
        }

        // Log skipped patterns
        if (result.skippedPatterns.length > 0) {
            result.skippedPatterns.forEach((pattern) => {
                console.log(
                    `${CLI_PROGRESS_ITEM_INDENT}${Icons.WARNING} '${pattern}' already exists in .gitignore, skipping...`
                );
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(
            `${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Failed to add gitignore patterns: ${errorMessage}`
        );
    }
};
