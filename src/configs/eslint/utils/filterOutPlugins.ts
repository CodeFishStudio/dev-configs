import type { Linter } from 'eslint';

export const filterOutPlugins = (configs: Linter.Config[], pluginNames: string[]) => {
    return configs.filter((config) => {
        if (!config.plugins) return true;
        return !Object.keys(config.plugins).some((plugin) => pluginNames.includes(plugin));
    });
};
