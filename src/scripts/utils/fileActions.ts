import { existsSync, copyFileSync, writeFileSync } from 'fs';

import { print, PrintType } from './print.js';

const printAction = (type: PrintType, message: string) => {
    print(message, { indent: 1, type });
};

export const fileActions = {
    copy: (sourcePath: string, targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        copyFileSync(sourcePath, targetPath);
        printAction('success', `Copied ${fileName}`);
    },

    copyError: (error: unknown, targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        printAction('error', `Failed to copy ${fileName}: ${errorMsg}`);
    },

    create: (targetPath: string, content: string) => {
        const fileName = fileActions.getFileName(targetPath);
        writeFileSync(targetPath, content);
        printAction('success', `Created ${fileName}`);
    },

    createError: (error: unknown, targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        const errorMsg = error instanceof Error ? error.message : String(error);
        printAction('error', `Failed to create ${fileName}: ${errorMsg}`);
    },

    getFileName: (path: string) => path.split('/').pop() || path,

    skipIfExists: (targetPath: string) => {
        const fileName = fileActions.getFileName(targetPath);
        if (existsSync(targetPath)) {
            printAction('skipped', `${fileName} already exists, skipping...`);
            return true;
        }
        return false;
    },
};
