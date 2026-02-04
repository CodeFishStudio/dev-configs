export const filterOutPlugins = (configs, pluginNames) => {
    return configs.filter((config) => {
        if (!config.plugins)
            return true;
        return !Object.keys(config.plugins).some((plugin) => pluginNames.includes(plugin));
    });
};
//# sourceMappingURL=filterOutPlugins.js.map