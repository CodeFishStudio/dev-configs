import { existsSync } from 'fs';
import { join } from 'path';

import { eslintScripts } from '../../configs/eslint/scripts.js';
import { prettierScripts } from '../../configs/prettier/scripts.js';
import { typescriptScripts } from '../../configs/typescript/scripts.js';
import { CLI_PROGRESS_ITEM_INDENT } from '../utils/constants.js';
import { Icons } from '../utils/enums.js';
import { getPackageManager } from '../utils/getPackageManager.js';
import {
    addScripts,
    getConflictingScripts,
    isValidPackageJson,
    readPackageJson,
    writePackageJson,
} from '../utils/packageJsonUtils.js';

import type { ConfigType, PackageManager, PackageJsonScriptDefinition } from '../../types/index.js';

/**
 * Map of config types to their script definitions
 */
const configScripts: Record<ConfigType, readonly PackageJsonScriptDefinition[]> = {
    typescript: typescriptScripts,
    prettier: prettierScripts,
    eslint: eslintScripts,
};

/**
 * Get all scripts for a given config type
 * @param configType - Selected config type
 * @param packageManager - The package manager being used (pnpm, npm, yarn)
 * @returns Array of script definitions with package manager placeholders resolved
 */
const getScriptsForConfigType = (
    configType: ConfigType,
    packageManager: PackageManager
): PackageJsonScriptDefinition[] => {
    return configScripts[configType].map((script) => ({
        ...script,
        command: script.command.replace(/{{PACKAGE_MANAGER}}/g, packageManager),
    }));
};

/**
 * Function to add scripts for a specific config type
 */
export const addScriptsForConfigType = async (configType: ConfigType): Promise<void> => {
    const packageManager = getPackageManager();
    const directory = process.cwd();

    try {
        // Check if package.json exists
        const packageJsonPath = join(directory, 'package.json');
        if (!existsSync(packageJsonPath)) {
            console.error(
                `${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} No package.json found in directory`
            );
            return;
        }

        // Read existing package.json
        const existingPackageJson = readPackageJson(directory);
        if (!existingPackageJson || !isValidPackageJson(existingPackageJson)) {
            console.error(
                `${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Invalid or corrupted package.json`
            );
            return;
        }

        // Get scripts to add
        const scriptsToAdd = getScriptsForConfigType(configType, packageManager);
        const scriptNamesToAdd = scriptsToAdd.map((script) => script.name);

        // Always skip existing scripts (as per requirements)
        const scriptsToSkip = getConflictingScripts(existingPackageJson, scriptNamesToAdd);
        const filteredScriptsToAdd = scriptsToAdd.filter(
            (script) => !scriptsToSkip.includes(script.name)
        );
        // Only proceed if there are scripts to add
        if (filteredScriptsToAdd.length === 0) {
            if (scriptsToSkip.length > 0) {
                scriptsToSkip.forEach((scriptName) => {
                    console.log(
                        `${CLI_PROGRESS_ITEM_INDENT}${Icons.SKIPPED} '${scriptName}' package.json script already exists, skipping...`
                    );
                });
            }
            return;
        }

        const scriptsRecord = Object.fromEntries(
            filteredScriptsToAdd.map((script) => [script.name, script.command])
        );

        // Add scripts to package.json
        const updatedPackageJson = addScripts(existingPackageJson, scriptsRecord);
        const writeResult = writePackageJson(directory, updatedPackageJson);

        if (!writeResult.success) {
            console.error(`${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} ${writeResult.message}`);
            return;
        }

        // Log added scripts
        filteredScriptsToAdd.forEach((script) => {
            console.log(
                `${CLI_PROGRESS_ITEM_INDENT}${Icons.SUCCESS} Added '${script.name}' package.json script`
            );
        });

        // Log skipped scripts
        if (scriptsToSkip.length > 0) {
            scriptsToSkip.forEach((scriptName) => {
                console.log(
                    `${CLI_PROGRESS_ITEM_INDENT}${Icons.SKIPPED} '${scriptName}' package.json script already exists, skipping...`
                );
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(
            `${CLI_PROGRESS_ITEM_INDENT}${Icons.ERROR} Failed to add package.json scripts: ${errorMessage}`
        );
    }
};
