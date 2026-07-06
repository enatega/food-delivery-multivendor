import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

// Flat-config equivalent of the project's previous .eslintrc.json, which
// extended ["next", "next/core-web-vitals", "eslint:recommended"] with a set
// of custom rules. We intentionally do NOT pull in `next/typescript`
// (typescript-eslint's recommended ruleset) since the original config never
// did — only the explicitly listed @typescript-eslint rules below are active.
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**",
      // `next lint` never scanned Cypress tests; keep them out of `eslint .`.
      "cypress/**",
    ],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  // TypeScript files: register the @typescript-eslint parser + plugin, and
  // keep the plugin's rules co-located with it (flat-config requirement).
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          // Match the pre-upgrade default (typescript-eslint v7 did not flag
          // unused caught errors); v8 changed the default to "all".
          caughtErrors: "none",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Project-wide rules and globals.
  {
    plugins: {
      prettier,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      globals: {
        window: "readonly",
        cy: "readonly",
        it: "readonly",
        React: "readonly",
        google: "readonly",
        GeolocationPosition: "readonly",
        GeolocationPositionError: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      // Superseded by @typescript-eslint/no-unused-vars; the base rule
      // misfires on TS type-only parameter names.
      "no-unused-vars": "off",

      "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],

      "max-lines": [
        "warn",
        { max: 550, skipBlankLines: true, skipComments: true },
      ],

      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // The project previously enforced only `rules-of-hooks` (via
      // eslint-config-next 14). eslint-plugin-react-hooks v7 — pulled in by
      // eslint-config-next 16 — enables a large set of new React Compiler
      // rules in its recommended config. Disable those to preserve the
      // project's prior lint behavior; adopting them is a separate effort.
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/static-components": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/immutability": "off",
      "react-hooks/globals": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/unsupported-syntax": "off",
      "react-hooks/config": "off",
      "react-hooks/gating": "off",
    },
  },
];

export default eslintConfig;
