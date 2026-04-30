import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
      },
      globals: {
        process: "readonly",
        cy: "readonly",
        it: "readonly",
        React: "readonly",
        google: "readonly",
        GeolocationPosition: "readonly",
        GeolocationPositionError: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
      react: reactPlugin,
    },
    rules: {
      // Allow .tsx and .jsx extensions for JSX files
      // "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
      "max-lines": [
        "warn",
        { max: 500, skipBlankLines: true, skipComments: true },
      ],

      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/no-var-requires": "off",

      // Remove unused variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      // Remove unused imports automatically
      // "unused-imports/no-unused-imports": "error",

      // Warn on unused variables but allow unused arguments prefixed with _
      "unused-imports/no-unused-vars": "error",

      // Prettier-related rules
      // Uncomment the following line to enable prettier integration
      // "prettier/prettier": ["error", {}, { "usePrettierrc": true }],

      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // reactPlugin.configs.flat.recommended,
];
