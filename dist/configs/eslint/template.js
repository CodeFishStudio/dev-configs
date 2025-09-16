import { reactNativeEslintTemplate } from './reactNative.template.js';
import { reactNextEslintTemplate } from './reactNext.template.js';
const defaultTemplate = `import { eslintConfigs } from 'cfs-dev-configs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.{{PROJECT_TYPE}},

    // Add any overrides below
]);
`;
export const eslintConfigFileTemplate = (projectType) => {
    switch (projectType) {
        case 'reactNative':
            return reactNativeEslintTemplate;
        case 'reactNext':
            return reactNextEslintTemplate;
        default:
            return defaultTemplate.replace('{{PROJECT_TYPE}}', projectType);
    }
};
//# sourceMappingURL=template.js.map