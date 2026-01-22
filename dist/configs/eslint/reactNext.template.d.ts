/**
 * Mimics the ESLint config file that comes from the `create next-app` tool.
 */
export declare const reactNextEslintTemplate = "import { eslintConfigs } from '@codefish/dev-configs';\nimport { defineConfig, globalIgnores } from 'eslint/config';\nimport nextVitals from 'eslint-config-next/core-web-vitals';\nimport nextTs from 'eslint-config-next/typescript';\n\nconst eslintConfig = defineConfig([\n    ...nextVitals,\n    ...nextTs,\n    ...eslintConfigs.reactNext,\n    globalIgnores([\n        // Default ignores of eslint-config-next:\n        '.next/**',\n        'out/**',\n        'build/**',\n        'next-env.d.ts',\n    ]),\n]);\n\nexport default eslintConfig;\n";
