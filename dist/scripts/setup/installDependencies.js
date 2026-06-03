import { spinner } from '@clack/prompts';
import { configTypeOptions } from './options.js';
import { installDevDependencies } from '../../setup/devDependencies.js';
import { getPackageManager } from '../utils/getPackageManager.js';
const getConfigTypeLabel = (configType) => {
    const option = configTypeOptions.find((opt) => opt.value === configType);
    return option?.label || configType;
};
/**
 * Install dependencies for a config type (used by cfs-setup).
 */
export const installDependencies = async (configType, projectType) => {
    const configLabel = getConfigTypeLabel(configType);
    const s = spinner();
    try {
        s.start(`Installing ${configLabel} dependencies`);
        const packageManager = getPackageManager();
        await installDevDependencies({
            projectType,
            packageManager,
            cwd: process.cwd(),
            configTypes: [configType],
        });
        s.stop(configLabel);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        s.error(`Failed to install ${configLabel} dependencies: ${errorMessage}`);
    }
};
//# sourceMappingURL=installDependencies.js.map