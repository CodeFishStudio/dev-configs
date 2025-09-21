/**
 * Mimics the ESLint config file that comes from the `create next-app` tool.
 */
export const reactNextEslintTemplate = `import { eslintConfigs } from '@codefish/dev-configs';
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
//# sourceMappingURL=reactNext.template.js.map