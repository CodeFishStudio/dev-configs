import { copyFileSync, existsSync, writeFileSync } from 'fs';

import { logStep } from '../setup/utils.js';

export const fileActions = {
    copy: (sourcePath: string, targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        copyFileSync(sourcePath, targetPath);
        logStep(`Copied ${fileName}`, 'success');
    },

    copySilent: (sourcePath: string, targetPath: string) => {
        copyFileSync(sourcePath, targetPath);
    },

    copyError: (error: unknown, targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        logStep(`Failed to copy ${fileName}: ${errorMsg}`, 'error');
    },

    create: (targetPath: string, content: string) => {
        const fileName = fileActions.getFileName(targetPath);
        writeFileSync(targetPath, content);
        logStep(`Created ${fileName}`, 'success');
    },

    createError: (error: unknown, targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        logStep(`Failed to create ${fileName}: ${errorMsg}`, 'error');
    },

    getFileName: (path: string) => path.split('/').pop() || path,

    skipIfExists: (targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        if (existsSync(targetPath)) {
            logStep(`${fileName} already exists, skipping...`, 'skipped');
            return true;
        }
        return false;
    },

    skipIfExistsSilent: (targetPath: string) => {
        return existsSync(targetPath);
    },
};
