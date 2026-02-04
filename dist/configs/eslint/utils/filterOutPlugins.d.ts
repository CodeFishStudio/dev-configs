import type { Linter } from 'eslint';
export declare const filterOutPlugins: (configs: Linter.Config[], pluginNames: string[]) => Linter.Config<import("@eslint/core", { with: { "resolution-mode": "require" } }).RulesConfig>[];
