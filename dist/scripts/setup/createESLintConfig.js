import { join } from 'path/posix';
import { eslintConfigFileTemplate } from '../../configs/eslint/template.js';
import { fileActions } from '../utils/fileActions.js';
/**
 * Function to create ESLint config file
 */
export const createESLintConfig = (projectType) => {
    // The `create next-app` outputs the ESLint config as an `mjs` file.
    const extension = projectType === 'reactNext' ? 'mjs' : 'js';
    const targetPath = join(process.cwd(), `eslint.config.${extension}`);
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