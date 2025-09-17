import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { print } from './print.js';
const printAction = (type, message) => {
    print(message, { indent: 1, type });
};
export const fileActions = {
    copy: (sourcePath, targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        copyFileSync(sourcePath, targetPath);
        printAction('success', `Copied ${fileName}`);
    },
    copySilent: (sourcePath, targetPath) => {
        copyFileSync(sourcePath, targetPath);
    },
    copyError: (error, targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        printAction('error', `Failed to copy ${fileName}: ${errorMsg}`);
    },
    create: (targetPath, content) => {
        const fileName = fileActions.getFileName(targetPath);
        writeFileSync(targetPath, content);
        printAction('success', `Created ${fileName}`);
    },
    createError: (error, targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        printAction('error', `Failed to create ${fileName}: ${errorMsg}`);
    },
    getFileName: (path) => path.split('/').pop() || path,
    skipIfExists: (targetPath) => {
        const fileName = fileActions.getFileName(targetPath);
        if (existsSync(targetPath)) {
            printAction('skipped', `${fileName} already exists, skipping...`);
            return true;
        }
        return false;
    },
    skipIfExistsSilent: (targetPath) => {
        return existsSync(targetPath);
    },
};
//# sourceMappingURL=fileActions.js.map