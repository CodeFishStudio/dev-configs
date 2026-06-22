import type { ProjectType } from '../../types/index.js';
/**
 * Dependencies required for Prettier
 */
export declare const prettierDependencies: {
    readonly prettier: "^3";
};
/**
 * Additional Prettier dependencies for Tailwind CSS projects
 */
export declare const prettierTailwindDependencies: {
    readonly 'prettier-plugin-tailwindcss': "^0.8";
};
export declare const usesTailwindCss: (projectType: ProjectType) => boolean;
