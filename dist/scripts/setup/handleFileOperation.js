import { existsSync } from 'fs';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { Icons } from '../utils/enums.js';
/**
 * Helper function to handle file operations with consistent error handling and output
 */
export const handleFileOperation = (targetPath, operation, successMessage, errorMessage) => {
    const fileName = targetPath.split('/').pop() || targetPath;
    if (existsSync(targetPath)) {
        console.log(`${CLI_PROGRESS_ITEM_INDENT}${Icons.WARNING} ${fileName} already exists, skipping...`);
        return;
    }
    try {
        operation();
        console.log(`${CLI_PROGRESS_ITEM_INDENT}${Icons.SUCCESS} ${successMessage(fileName)}`);
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} ${errorMessage(fileName)}:`, errorMsg);
    }
};
//# sourceMappingURL=handleFileOperation.js.map