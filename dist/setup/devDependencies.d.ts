import type { ConfigType, PackageManager, ProjectType } from '../types/index.js';
/**
 * Install devDependencies for the given project type in the target directory.
 */
export declare const installDevDependencies: (options: {
    projectType: ProjectType;
    cwd: string;
    packageManager: PackageManager;
    configTypes?: ConfigType[];
}) => Promise<void>;
