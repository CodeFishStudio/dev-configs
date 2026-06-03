import type { ProjectType } from '../types/index.js';

const reactProjectTypes: ProjectType[] = ['nextjs', 'tanstackStart', 'vite', 'expo'];

/**
 * Whether the selected project type is a React stack (web or native).
 */
export const isReactProjectType = (projectType: ProjectType): boolean =>
    reactProjectTypes.includes(projectType);
