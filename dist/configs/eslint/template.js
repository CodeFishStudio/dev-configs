const defaultTemplate = `import { eslintConfigs } from 'cfs-dev-configs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...eslintConfigs.{{PROJECT_TYPE}},

    // Add any overrides below
]);
`;
/**
 * Mimics the ESLint config file that comes from the `create next-app` tool.
 */
const nextTemplate = `import { eslintConfigs } from 'cfs-dev-configs';
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...eslintConfigs.react,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
`;
export const eslintConfigFileTemplate = (projectType) => {
    switch (projectType) {
        case 'reactNext':
            return nextTemplate;
        default:
            return defaultTemplate.replace('{{PROJECT_TYPE}}', projectType);
    }
};
//# sourceMappingURL=template.js.map