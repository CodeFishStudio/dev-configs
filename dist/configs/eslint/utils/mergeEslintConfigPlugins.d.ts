import type { Linter } from 'eslint';
/**
 * Merges ESLint configs and deduplicates plugins to avoid redefinition errors.
 * Returns an array with all plugins defined once at the beginning, followed by
 * all configs with their plugin definitions removed.
 */
export declare const mergeEslintConfigPlugins: (configs: Linter.Config[]) => Linter.Config[];
