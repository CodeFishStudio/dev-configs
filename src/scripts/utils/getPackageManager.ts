import { existsSync } from 'fs';
import { join } from 'path';

import { PackageManager } from '../../types/index.js';

// Cache the package manager to avoid multiple checks
let packageManager: PackageManager | undefined;

export const getPackageManager = (): PackageManager => {
    // Return cached value if available
    if (packageManager) return packageManager;

    packageManager = 'npm';

    if (
        existsSync(join(process.cwd(), 'bun.lock')) ||
        existsSync(join(process.cwd(), 'bun.lockb'))
    ) {
        packageManager = 'bun';
    } else if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    } else if (existsSync(join(process.cwd(), 'yarn.lock'))) {
        packageManager = 'yarn';
    }

    return packageManager;
};
