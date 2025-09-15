import { join } from 'path/posix';
import { fileActions } from './fileActions.js';
import { eslintConfigFileTemplate } from '../../configs/eslint/template.js';
/**
 * Function to create ESLint config file
 */
export const createESLintConfig = (projectType) => {
    const targetPath = join(process.cwd(), 'eslint.config.js');
    if (fileActions.skipIfExists(targetPath))
        return;
    try {
        fileActions.create(targetPath, eslintConfigFileTemplate(projectType));
    }
    catch (error) {
        fileActions.createError(error, targetPath);
    }
};
//# sourceMappingURL=createESLintConfig.js.map