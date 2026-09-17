import { mergeEslintConfigPlugins } from './utils/mergeEslintConfigPlugins.js';
import type { ProjectType } from '../../types/index.js';
import type { Linter } from 'eslint';
declare const eslintConfigs: Record<ProjectType, Linter.Config[]>;
export { eslintConfigs, mergeEslintConfigPlugins };
