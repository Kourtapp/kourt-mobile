// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    ignores: [
      "dist/*",
      "node_modules/*",
      ".expo/*",
      "coverage/*",
      "supabase/functions/*", // Deno edge functions use different imports
      "scripts/*", // Utility scripts don't need strict linting
    ],
  },
  {
    rules: {
      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      // General
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],

      // React hooks - warn only (many false positives with callbacks)
      "react-hooks/exhaustive-deps": "warn",

      // Allow require in specific cases (dynamic imports, tests)
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Test files configuration
  {
    files: ["**/__tests__/**/*", "**/*.test.ts", "**/*.test.tsx", "jest.setup.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
  // Scripts configuration (Node.js)
  {
    files: ["scripts/**/*"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
  },
];
