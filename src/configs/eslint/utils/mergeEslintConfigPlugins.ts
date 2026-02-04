import type { Linter } from 'eslint';

type PluginRecord = Extract<NonNullable<Linter.Config['plugins']>, Record<string, unknown>>;

/**
 * Merges ESLint configs and deduplicates plugins to avoid redefinition errors.
 * Returns an array with all plugins defined once at the beginning, followed by
 * all configs with their plugin definitions removed.
 */
export const mergeEslintConfigPlugins = (configs: Linter.Config[]): Linter.Config[] => {
    const mergedPlugins: PluginRecord = {};

    // Collect all plugins from all configs
    for (const config of configs) {
        if (config.plugins) {
            Object.assign(mergedPlugins, config.plugins);
        }
    }

    // Build the result array: first define all plugins once, then apply all configs
    const result: Linter.Config[] = [];

    // Only add plugins config if there are actual plugins
    if (Object.keys(mergedPlugins).length > 0) {
        result.push({
            plugins: mergedPlugins,
        });
    }

    // Then add all configs, removing plugin definitions to avoid redefinition
    result.push(
        ...configs.map((config) => {
            // Remove plugins from configs that try to redefine them
            // Plugins are already available from the merged definition above
            if (config.plugins) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars -- using destructuring to remove the `plugins` property
                const { plugins, ...rest } = config;
                return rest;
            }
            return config;
        })
    );

    return result;
};
