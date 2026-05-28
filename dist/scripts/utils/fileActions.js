import { copyFileSync, existsSync, writeFileSync } from 'fs';
import { logStep } from '../setup/utils.js';
export const fileActions = {
    copy: (sourcePath, targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        copyFileSync(sourcePath, targetPath);
        logStep(`Copied ${fileName}`, 'success');
    },
    copySilent: (sourcePath, targetPath) => {
        copyFileSync(sourcePath, targetPath);
    },
    copyError: (error, targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        logStep(`Failed to copy ${fileName}: ${errorMsg}`, 'error');
    },
    create: (targetPath, content) => {
        const fileName = fileActions.getFileName(targetPath);
        writeFileSync(targetPath, content);
        logStep(`Created ${fileName}`, 'success');
    },
    createError: (error, targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        logStep(`Failed to create ${fileName}: ${errorMsg}`, 'error');
    },
    getFileName: (path) => path.split('/').pop() || path,
    skipIfExists: (targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        if (existsSync(targetPath)) {
            logStep(`${fileName} already exists, skipping...`, 'skipped');
            return true;
        }
        return false;
    },
    skipIfExistsSilent: (targetPath) => {
        return existsSync(targetPath);
    },
};
//# sourceMappingURL=fileActions.js.map