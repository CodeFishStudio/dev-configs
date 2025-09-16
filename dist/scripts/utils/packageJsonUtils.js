import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { print } from './print.js';
/**
 * Read and parse package.json from a directory
 * @param directory - Directory containing package.json
 * @returns Parsed package.json object or null if not found/invalid
 */
export const readPackageJson = (directory) => {
    const packageJsonPath = join(directory, 'package.json');
    if (!existsSync(packageJsonPath)) {
        return null;
    }
    try {
        const content = readFileSync(packageJsonPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        print(`Failed to parse package.json: ${error instanceof Error ? error.message : String(error)}`, { type: 'error' });
        return null;
    }
};
/**
 * Write package.json to a directory
 * @param directory - Directory to write package.json to
 * @param packageJson - Package.json object to write
 * @param options - Options for writing
 * @returns Result of the operation
 */
export const writePackageJson = (directory, packageJson) => {
    const packageJsonPath = join(directory, 'package.json');
    const indent = 2;
    try {
        // Write the new package.json
        const content = JSON.stringify(packageJson, null, indent);
        writeFileSync(packageJsonPath, content, 'utf-8');
        return {
            success: true,
            message: 'package.json updated successfully',
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to write package.json: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
};
/**
 * Add multiple scripts to package.json
 * @param packageJson - Package.json object to modify
 * @param scripts - Object of script names to commands
 * @returns Modified package.json object
 */
export const addScripts = (packageJson, scripts) => {
    const updated = { ...packageJson };
    if (!updated.scripts) {
        updated.scripts = {};
    }
    Object.entries(scripts).forEach(([name, command]) => {
        updated.scripts[name] = command;
    });
    return updated;
};
/**
 * Validate package.json structure
 * @param packageJson - Package.json object to validate
 * @returns True if valid, false otherwise
 */
export const isValidPackageJson = (packageJson) => {
    if (!packageJson || typeof packageJson !== 'object') {
        return false;
    }
    const pkg = packageJson;
    // Check if scripts is an object if it exists
    if (pkg.scripts !== undefined && (typeof pkg.scripts !== 'object' || pkg.scripts === null)) {
        return false;
    }
    return true;
};
//# sourceMappingURL=packageJsonUtils.js.map