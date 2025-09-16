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
export declare const readPackageJson: (directory: string) => PackageJson | null;
/**
 * Write package.json to a directory
 * @param directory - Directory to write package.json to
 * @param packageJson - Package.json object to write
 * @param options - Options for writing
 * @returns Result of the operation
 */
export declare const writePackageJson: (directory: string, packageJson: PackageJson) => PackageJsonResult;
/**
 * Add multiple scripts to package.json
 * @param packageJson - Package.json object to modify
 * @param scripts - Object of script names to commands
 * @returns Modified package.json object
 */
export declare const addScripts: (packageJson: PackageJson, scripts: Record<string, string>) => PackageJson;
/**
 * Validate package.json structure
 * @param packageJson - Package.json object to validate
 * @returns True if valid, false otherwise
 */
export declare const isValidPackageJson: (packageJson: unknown) => packageJson is PackageJson;
export {};
