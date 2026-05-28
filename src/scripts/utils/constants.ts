import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * ES module equivalent of __dirname
 */
export const __dirname = dirname(fileURLToPath(import.meta.url));
