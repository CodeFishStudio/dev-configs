import { existsSync } from 'fs';
import { join } from 'path';
import { eslintScripts } from '../../configs/eslint/scripts.js';
import { prettierScripts } from '../../configs/prettier/scripts.js';
import { typescriptScripts } from '../../configs/typescript/scripts.js';
import { getPackageManager } from '../utils/getPackageManager.js';
import { addScripts, isValidPackageJson, readPackageJson, writePackageJson, } from '../utils/packageJsonUtils.js';
import { print } from '../utils/print.js';
/**
 * Map of config types to their script definitions
 */
const configScripts = {
    typescript: typescriptScripts,
    prettier: prettierScripts,
    eslint: eslintScripts,
    editor: [],
};
/**
 * Get all scripts for a given config type
 * @returns Array of script definitions with package manager placeholders resolved
 */
const getScriptsForConfigType = (configType, packageManager) => {
    return configScripts[configType].map((script) => ({
        ...script,
        command: script.command.replace(/{{PACKAGE_MANAGER}}/g, packageManager),
    }));
};
/**
 * Function to add package.json scripts for a specific config type
 */
export const addPackageJsonScripts = async (configType) => {
    const packageManager = getPackageManager();
    const directory = process.cwd();
    try {
        // Check if package.json exists
        const packageJsonPath = join(directory, 'package.json');
        if (!existsSync(packageJsonPath)) {
            print(`No package.json found in directory`, { indent: 1, type: 'error' });
            return;
        }
        // Read existing package.json
        const existingPackageJson = readPackageJson(directory);
        if (!existingPackageJson || !isValidPackageJson(existingPackageJson)) {
            print(`Invalid or corrupted package.json`, { indent: 1, type: 'error' });
            return;
        }
        // Get scripts to add
        const scriptsToAdd = getScriptsForConfigType(configType, packageManager);
        const scriptsRecord = Object.fromEntries(scriptsToAdd.map((script) => [script.name, script.command]));
        // Add scripts to package.json
        const updatedPackageJson = addScripts(existingPackageJson, scriptsRecord);
        const writeResult = writePackageJson(directory, updatedPackageJson);
        if (!writeResult.success) {
            print(writeResult.message, { indent: 1, type: 'error' });
            return;
        }
        // Log added scripts
        scriptsToAdd.forEach((script) => {
            print(`Added '${script.name}' package.json script`, { indent: 1, type: 'success' });
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        print(`Failed to add package.json scripts: ${errorMessage}`, { indent: 1, type: 'error' });
    }
};
//# sourceMappingURL=addPackageJsonScripts.js.map