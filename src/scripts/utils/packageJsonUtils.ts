import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { print } from './print.js';

/**
 * Interface for package.json structure
 */
interface PackageJson {
    name?: string;
    version?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
}

/**
 * Result of package.json operations
 */
interface PackageJsonResult {
    success: boolean;
    message: string;
}

/**
 * Read and parse package.json from a directory
 * @param directory - Directory containing package.json
 * @returns Parsed package.json object or null if not found/invalid
 */
export const readPackageJson = (directory: string): PackageJson | null => {
    const packageJsonPath = join(directory, 'package.json');

    if (!existsSync(packageJsonPath)) {
        return null;
    }

    try {
        const content = readFileSync(packageJsonPath, 'utf-8');
        return JSON.parse(content) as PackageJson;
    } catch (error) {
        print(
            `Failed to parse package.json: ${error instanceof Error ? error.message : String(error)}`,
            { type: 'error' }
        );
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
export const writePackageJson = (
    directory: string,
    packageJson: PackageJson
): PackageJsonResult => {
    const packageJsonPath = join(directory, 'package.json');

    try {
        // Write the new package.json
        const content = JSON.stringify(packageJson, null, 4);
        writeFileSync(packageJsonPath, content, 'utf-8');

        return {
            success: true,
            message: 'package.json updated successfully',
        };
    } catch (error) {
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
export const addScripts = (
    packageJson: PackageJson,
    scripts: Record<string, string>
): PackageJson => {
    const updated = { ...packageJson };

    Object.entries(scripts).forEach(([name, command]) => {
        if (!updated.scripts) {
            updated.scripts = {};
        }

        updated.scripts[name] = command;
    });

    return updated;
};

/**
 * Validate package.json structure
 * @param packageJson - Package.json object to validate
 * @returns True if valid, false otherwise
 */
export const isValidPackageJson = (packageJson: unknown): packageJson is PackageJson => {
    if (!packageJson || typeof packageJson !== 'object') {
        return false;
    }

    const pkg = packageJson as Record<string, unknown>;

    // Check if scripts is an object if it exists
    if (pkg.scripts !== undefined && (typeof pkg.scripts !== 'object' || pkg.scripts === null)) {
        return false;
    }

    return true;
};
