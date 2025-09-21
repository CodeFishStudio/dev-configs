/**
 * Mimics the ESLint config file that comes from the `create next-app` tool.
 */
export declare const reactNextEslintTemplate = "import { eslintConfigs } from '@codefish/dev-configs';\nimport { dirname } from \"path\";\nimport { fileURLToPath } from \"url\";\nimport { FlatCompat } from \"@eslint/eslintrc\";\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n\nconst compat = new FlatCompat({\n  baseDirectory: __dirname,\n});\n\nconst eslintConfig = [\n  ...compat.extends(\"next/core-web-vitals\", \"next/typescript\"),\n  ...eslintConfigs.react,\n  {\n    ignores: [\n      \"node_modules/**\",\n      \".next/**\",\n      \"out/**\",\n      \"build/**\",\n      \"next-env.d.ts\",\n    ],\n  },\n];\n\nexport default eslintConfig;\n";
