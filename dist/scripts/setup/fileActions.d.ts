export declare const fileActions: {
    copy: (sourcePath: string, targetPath: string) => void;
    copyError: (error: unknown, targetPath: string) => void;
    create: (targetPath: string, content: string) => void;
    createError: (error: unknown, targetPath: string) => void;
    skipIfExists: (targetPath: string) => boolean;
};
