import { gitignorePatterns as editorGitignorePatterns } from '../../configs/editors/gitignore.js';
import { gitignorePatterns as eslintGitignorePatterns } from '../../configs/eslint/gitignore.js';
import { addGitignorePatterns } from '../utils/gitignoreUtils.js';
import { print } from '../utils/print.js';

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
            print(result.message, { indent: 1, type: 'error' });
            return;
        }

        // Log added patterns
        if (result.addedPatterns.length > 0) {
            const entryCount = result.addedPatterns.length;
            const entryText = entryCount === 1 ? 'entry' : 'entries';
            print(`Added ${entryCount} ${entryText} to .gitignore`, { indent: 1, type: 'success' });
        }

        // Log skipped patterns
        if (result.skippedPatterns.length > 0) {
            const skippedCount = result.skippedPatterns.length;
            const entryText = skippedCount === 1 ? 'entry' : 'entries';
            print(`Skipped ${skippedCount} ${entryText} already in .gitignore`, {
                indent: 1,
                type: 'skipped',
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        print(`Failed to add gitignore patterns: ${errorMessage}`, { indent: 1, type: 'error' });
    }
};
