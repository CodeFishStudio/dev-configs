import { globalIgnores } from 'eslint/config';

/**
 * Global ESLint ignores shared across web projects (Next.js, Vite, TanStack Start).
 * shadcn/ui components are generated and should not be linted.
 */
export const webGlobalIgnores = globalIgnores(['src/components/ui/**']);
