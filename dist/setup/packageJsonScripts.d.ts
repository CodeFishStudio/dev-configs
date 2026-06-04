import type { ConfigType, PackageManager } from '../types/index.js';
/**
 * Add package.json scripts for one or more config types
 */
export declare const addPackageJsonScripts: (options: {
    cwd: string;
    packageManager: PackageManager;
    configTypes: ConfigType[];
}) => Promise<void>;
