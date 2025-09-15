import { gitignorePatterns as editorGitignorePatterns } from '../../configs/editors/gitignore.js';
import { gitignorePatterns as eslintGitignorePatterns } from '../../configs/eslint/gitignore.js';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { Icons } from '../utils/enums.js';
import { addGitignorePatterns } from '../utils/gitignoreUtils.js';

import type { ConfigType } from '../../types/index.js';

/**
 * Map of config types to their gitignore patterns
 */
const configGitignorePatterns: Record<ConfigType, readonly string[]> = {
    eslint: eslintGitignorePatterns,
    prettier: [], // No patterns for prettier
    typescript: [], // No patterns for typescript
    editor: editorGitignorePatterns,
};

/**
 * Function to add gitignore patterns for a specific config type
 */
export const addGitignores = async (configType: ConfigType): Promise<void> => {
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
            const entryCount = result.addedPatterns.length;
            const entryText = entryCount === 1 ? 'entry' : 'entries';
            console.log(
                `${CLI_PROGRESS_ITEM_INDENT}${Icons.SUCCESS} Added ${entryCount} ${entryText} to .gitignore`
            );
        }

        // Log skipped patterns
        if (result.skippedPatterns.length > 0) {
            const skippedCount = result.skippedPatterns.length;
            const entryText = skippedCount === 1 ? 'entry' : 'entries';
            console.log(
                `${CLI_PROGRESS_ITEM_INDENT}${Icons.SKIPPED} Skipped adding ${skippedCount} ${entryText} to .gitignore`
            );
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(
            `${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Failed to add gitignore patterns: ${errorMessage}`
        );
    }
};
