import { logStep } from './utils.js';
import { gitignorePatterns as editorGitignorePatterns } from '../../configs/editors/gitignore.js';
import { gitignorePatterns as eslintGitignorePatterns } from '../../configs/eslint/gitignore.js';
import { addGitignorePatterns } from '../utils/gitignoreUtils.js';
/**
 * Map of config types to their gitignore patterns
 */
const configGitignorePatterns = {
    eslint: eslintGitignorePatterns,
    prettier: [], // No patterns for prettier
    typescript: [], // No patterns for typescript
    cursorSettings: editorGitignorePatterns,
    agentRulesAndSkills: [],
};
/**
 * Function to add gitignore patterns for a specific config type
 */
export const addGitignores = async (configType) => {
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
            logStep(result.message, 'error');
            return;
        }
        // Log added patterns
        if (result.addedPatterns.length > 0) {
            const entryCount = result.addedPatterns.length;
            const entryText = entryCount === 1 ? 'entry' : 'entries';
            logStep(`Added ${entryCount} ${entryText} to .gitignore`, 'success');
        }
        // Log skipped patterns
        if (result.skippedPatterns.length > 0) {
            const skippedCount = result.skippedPatterns.length;
            const entryText = skippedCount === 1 ? 'entry' : 'entries';
            logStep(`Skipped ${skippedCount} ${entryText} already in .gitignore`, 'skipped');
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep(`Failed to add gitignore patterns: ${errorMessage}`, 'error');
    }
};
//# sourceMappingURL=addGitignores.js.map