export const expoEslintTemplate = `import { eslintConfigs } from '@codefish/dev-configs';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.expo,

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
