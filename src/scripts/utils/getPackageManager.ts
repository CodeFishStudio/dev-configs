import { existsSync } from 'fs';
import { join } from 'path';

type PackageManager = 'npm' | 'pnpm' | 'yarn';

let packageManager: PackageManager | undefined;

export const getPackageManager = (): PackageManager => {
    if (packageManager) return packageManager;

    packageManager = 'npm';

    if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    } else if (existsSync(join(process.cwd(), 'yarn.lock'))) {
        packageManager = 'yarn';
    }

    return packageManager;
};
