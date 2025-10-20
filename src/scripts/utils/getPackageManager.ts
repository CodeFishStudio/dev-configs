import { existsSync } from 'fs';
import { join } from 'path';

import { PackageManager } from '../../types/index.js';

let packageManager: PackageManager | undefined;

export const getPackageManager = (): PackageManager => {
    if (packageManager) return packageManager;

    packageManager = 'npm';

    if (existsSync(join(process.cwd(), 'bun.lockb'))) {
        packageManager = 'bun';
    } else if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    } else if (existsSync(join(process.cwd(), 'yarn.lock'))) {
        packageManager = 'yarn';
    }

    return packageManager;
};
