import { defineConfig, globalIgnores } from 'eslint/config';

import { eslintConfigs } from './dist/index.js';

export default defineConfig([...eslintConfigs.node, globalIgnores(['dist/**/*'])]);
