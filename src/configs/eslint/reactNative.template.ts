export const reactNativeEslintTemplate = `import { eslintConfigs } from 'cfs-dev-configs';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.reactNative,

    globalIgnores([
        'android/**',
        'ios/**',
        '.expo/**',
        '.expo-shared/**',
        'plugins/**',
        'metro.config.js',
        'babel.config.js',
    ]),
]);
`;
