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
  {
    ignores: ["functions/**/*"],
  },
  {
    rules: {
      // Firebase SDK uses dynamic types extensively — 'any' is intentional
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      // Content strings with apostrophes/quotes in JSX are fine
      "react/no-unescaped-entities": "off",
      // Unused expressions rule conflicts with some SDK patterns
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];

export default eslintConfig;
