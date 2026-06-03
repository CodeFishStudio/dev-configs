import { expoEslintTemplate } from './expo.template.js';
import { nextjsEslintTemplate } from './nextjs.template.js';
import { tanstackStartEslintTemplate } from './tanstackStart.template.js';
const defaultTemplate = `import { eslintConfigs } from '@codefish/dev-configs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.{{PROJECT_TYPE}},

    // Add any overrides below
]);
`;
export const eslintConfigFileTemplate = (projectType) => {
    switch (projectType) {
        case 'expo':
            return expoEslintTemplate;
        case 'nextjs':
            return nextjsEslintTemplate;
        case 'tanstackStart':
            return tanstackStartEslintTemplate;
        default:
            return defaultTemplate.replace('{{PROJECT_TYPE}}', projectType);
    }
};
//# sourceMappingURL=template.js.map