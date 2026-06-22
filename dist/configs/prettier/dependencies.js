/**
 * Dependencies required for Prettier
 */
export const prettierDependencies = {
    prettier: '^3',
};
/**
 * Additional Prettier dependencies for Tailwind CSS projects
 */
export const prettierTailwindDependencies = {
    'prettier-plugin-tailwindcss': '^0.8',
};
const tailwindProjectTypes = [
    'tanstackStart',
    'nextjs',
    'vite',
];
export const usesTailwindCss = (projectType) => tailwindProjectTypes.includes(projectType);
//# sourceMappingURL=dependencies.js.map