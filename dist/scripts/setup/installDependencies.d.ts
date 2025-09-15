import type { ConfigType, ProjectType } from '../../types/index.js';
/**
 * Generic function to install dependencies for a config type
 */
export declare const installDependencies: (configType: ConfigType, projectType: ProjectType) => Promise<void>;
