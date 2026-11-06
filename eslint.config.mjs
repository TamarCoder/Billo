import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  globalIgnores([
    ".next/**",
    "out/**",
    "dist-electron/**",
    "release/**",
    "build/**",
  ]),
]);

export default eslintConfig;
