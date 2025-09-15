import { writeFileSync } from 'fs';
import { join } from 'path/posix';
import { handleFileOperation } from './handleFileOperation.js';
import { eslintConfigFileTemplate } from '../../configs/eslint/template.js';
/**
 * Function to create ESLint config file
 */
export const createESLintConfig = (projectType) => {
    const targetPath = join(process.cwd(), 'eslint.config.js');
    handleFileOperation(targetPath, () => {
        const configContent = eslintConfigFileTemplate(projectType);
        writeFileSync(targetPath, configContent);
    }, (fileName) => `Created ${fileName}`, (fileName) => `Failed to create ${fileName}`);
};
//# sourceMappingURL=createESLintConfig.js.map