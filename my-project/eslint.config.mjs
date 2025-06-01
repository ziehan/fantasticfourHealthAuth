import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import parserTs from "@typescript-eslint/parser";
import next from "eslint-config-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      js,
      react: pluginReact,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
    settings: {
      next: {
        rootDir: true,
      },
    },
  },
  ...next(), // ⬅️ Tambahkan ini agar plugin Next.js dikenali
]);
