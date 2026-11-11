import { mergeEslintConfigPlugins } from './utils/mergeEslintConfigPlugins.js';
import type { Linter } from 'eslint';
import type { ProjectType } from '../../types/index.js';
declare const eslintConfigs: Record<ProjectType | 'shadcn' | 'tanstackQuery', Linter.Config[]>;
export { eslintConfigs, mergeEslintConfigPlugins };
