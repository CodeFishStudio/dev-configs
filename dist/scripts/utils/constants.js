import { dirname } from 'path';
import { fileURLToPath } from 'url';
/**
 * ES module equivalent of __dirname
 */
export const __dirname = dirname(fileURLToPath(import.meta.url));
/**
 * An amount to indent presented options in the CLI.
 */
export const CLI_OPTION_INDENT = '  ';
/**
 * An amount to indent presented progress items in the CLI.
 */
export const CLI_PROGRESS_ITEM_INDENT = '  ';
//# sourceMappingURL=constants.js.map