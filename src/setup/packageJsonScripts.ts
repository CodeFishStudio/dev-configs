import { existsSync } from 'fs';
import { join } from 'path';

import { eslintScripts } from '../configs/eslint/scripts.js';
import { prettierScripts } from '../configs/prettier/scripts.js';
import { typescriptScripts } from '../configs/typescript/scripts.js';
import { logStep } from '../scripts/setup/utils.js';
import {
    addScripts,
    isValidPackageJson,
    readPackageJson,
    writePackageJson,
} from '../scripts/utils/packageJsonUtils.js';

import type { ConfigType, PackageJsonScriptDefinition, PackageManager } from '../types/index.js';

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
 * Add package.json scripts for one or more config types
 */
export const addPackageJsonScripts = async (options: {
    cwd: string;
    packageManager: PackageManager;
    configTypes: ConfigType[];
}): Promise<void> => {
    const { cwd, packageManager, configTypes } = options;

    try {
        const packageJsonPath = join(cwd, 'package.json');
        if (!existsSync(packageJsonPath)) {
            logStep('No package.json found in directory', 'error');
            return;
        }

        const existingPackageJson = readPackageJson(cwd);
        if (!existingPackageJson || !isValidPackageJson(existingPackageJson)) {
            logStep('Invalid or corrupted package.json', 'error');
            return;
        }

        const scriptsToAdd = configTypes.flatMap((configType) =>
            getScriptsForConfigType(configType, packageManager)
        );

        const scriptsRecord = Object.fromEntries(
            scriptsToAdd.map((script) => [script.name, script.command])
        );

        const updatedPackageJson = addScripts(existingPackageJson, scriptsRecord);
        const writeResult = writePackageJson(cwd, updatedPackageJson);

        if (!writeResult.success) {
            logStep(writeResult.message, 'error');
            return;
        }

        scriptsToAdd.forEach((script) => {
            logStep(`Added '${script.name}' package.json script`, 'success');
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep(`Failed to add package.json scripts: ${errorMessage}`, 'error');
    }
};
