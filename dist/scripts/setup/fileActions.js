import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { print } from './print.js';
const getFileName = (path) => path.split('/').pop() || path;
const printAction = (type, message) => {
    print(message, { indent: 1, type });
};
export const fileActions = {
    copy: (sourcePath, targetPath) => {
        const fileName = getFileName(targetPath);
        copyFileSync(sourcePath, targetPath);
        printAction('success', `Copied ${fileName}`);
    },
    copyError: (error, targetPath) => {
        const fileName = getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        printAction('error', `Failed to copy ${fileName}: ${errorMsg}`);
    },
    create: (targetPath, content) => {
        const fileName = getFileName(targetPath);
        writeFileSync(targetPath, content);
        printAction('success', `Created ${fileName}`);
    },
    createError: (error, targetPath) => {
        const fileName = getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        printAction('error', `Failed to create ${fileName}: ${errorMsg}`);
    },
    skipIfExists: (targetPath) => {
        const fileName = getFileName(targetPath);
        if (existsSync(targetPath)) {
            printAction('skipped', `${fileName} already exists, skipping...`);
            return true;
        }
        return false;
    },
};
//# sourceMappingURL=fileActions.js.map