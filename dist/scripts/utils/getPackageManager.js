import { existsSync } from 'fs';
import { join } from 'path';
// Cache the package manager to avoid multiple checks
let packageManager;
export const getPackageManager = () => {
    // Return cached value if available
    if (packageManager)
        return packageManager;
    packageManager = 'npm';
    if (existsSync(join(process.cwd(), 'bun.lock')) ||
        existsSync(join(process.cwd(), 'bun.lockb'))) {
        packageManager = 'bun';
    }
    else if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    }
    else if (existsSync(join(process.cwd(), 'yarn.lock'))) {
        packageManager = 'yarn';
    }
    return packageManager;
};
//# sourceMappingURL=getPackageManager.js.map