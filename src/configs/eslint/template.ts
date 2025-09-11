import { ProjectType } from '../../types/index.js';

export const eslintConfigFileTemplate = (
    projectType: ProjectType
) => `import { eslintConfigs } from 'cfs-dev-configs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.${projectType},

    // Add any overrides below
]);
`;
