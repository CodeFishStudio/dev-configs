import type { ConfigType, PackageManager, ProjectType } from '../types/index.js';
export interface InstallDevDependenciesOptions {
    projectType: ProjectType;
    cwd: string;
    packageManager: PackageManager;
    configTypes?: ConfigType[];
    onOutputLine?: (line: string) => void;
}
/**
 * Install devDependencies for the given project type in the target directory.
 */
export declare const installDevDependencies: (options: InstallDevDependenciesOptions) => Promise<void>;
