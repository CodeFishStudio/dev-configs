import type { ConfigType, ProjectType } from '../../types/index.js';
/**
 * Install dependencies for a config type (used by cfs-setup).
 */
export declare const installDependencies: (configType: ConfigType, projectType: ProjectType) => Promise<void>;
