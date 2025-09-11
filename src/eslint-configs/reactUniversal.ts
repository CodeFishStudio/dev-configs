import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import * as reactHooks from 'eslint-plugin-react-hooks';

import type { Linter } from 'eslint';

const reactPluginConfig = {
    ...reactPlugin.configs.flat.recommended,
    settings: {
        react: { version: 'detect' },
    },
};

/**
 * Universal React project ESLint configuration. Used across web and React
 * Native projects.
 */
export const reactUniversalConfig: Linter.Config[] = [
    importPlugin.flatConfigs.react,
    reactPluginConfig,
    reactPlugin.configs.flat['jsx-runtime']!,
    reactHooks.configs.recommended,
    {
        rules: {
            // Turns prop={'value'} into prop="value"
            'react/jsx-curly-brace-presence': ['warn', 'never'],

            // Prevent useless fragments
            'react/jsx-no-useless-fragment': 'warn',

            // Using Typescript for prop typing
            'react/prop-types': 'off',
        },
    },
];
