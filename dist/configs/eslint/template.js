export const eslintConfigFileTemplate = (projectType) => `import { eslintConfigs } from 'cfs-dev-configs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.${projectType},

    // Add any overrides below
]);
`;
//# sourceMappingURL=template.js.map