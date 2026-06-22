import type { ProjectType } from '../../types/index.js';

/**
 * Dependencies required for Prettier
 */
export const prettierDependencies = {
    prettier: '^3',
} as const;

/**
 * Additional Prettier dependencies for Tailwind CSS projects
 */
export const prettierTailwindDependencies = {
    'prettier-plugin-tailwindcss': '^0.8',
} as const;

const tailwindProjectTypes = [
    'tanstackStart',
    'nextjs',
    'vite',
] as const satisfies readonly ProjectType[];

export const usesTailwindCss = (projectType: ProjectType): boolean =>
    (tailwindProjectTypes as readonly ProjectType[]).includes(projectType);
