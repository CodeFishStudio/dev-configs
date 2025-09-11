import { existsSync } from 'fs';
import { join } from 'path';
let packageManager;
export const getPackageManager = () => {
    if (packageManager)
        return packageManager;
    packageManager = 'npm';
    if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    }
    else if (existsSync(join(process.cwd(), 'yarn.lock'))) {
        packageManager = 'yarn';
    }
    return packageManager;
};
//# sourceMappingURL=getPackageManager.js.map