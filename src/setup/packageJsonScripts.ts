import { existsSync } from 'fs';
import { join } from 'path';
import { eslintScripts } from '../configs/eslint/scripts.js';
import { prettierScripts } from '../configs/prettier/scripts.js';
import { typescriptScripts } from '../configs/typescript/scripts.js';
import {
    addScripts,
    isValidPackageJson,
    readPackageJson,
    writePackageJson,
} from '../utils/packageJsonUtils.js';
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

    const packageJsonPath = join(cwd, 'package.json');
    if (!existsSync(packageJsonPath)) {
        throw new Error('No package.json found in directory');
    }

    const existingPackageJson = readPackageJson(cwd);
    if (!existingPackageJson || !isValidPackageJson(existingPackageJson)) {
        throw new Error('Invalid or corrupted package.json');
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
        throw new Error(writeResult.message);
    }
};
