import type { ProjectType } from '../../types/index.js';
/**
 * Copy agent rule files to `.cursor/rules/`.
 * Overwrites any existing rule files at the same path; other files in the directory are left unchanged.
 */
export declare const copyAgentRules: (projectType: ProjectType) => void;
