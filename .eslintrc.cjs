module.exports = {
  parser: "@typescript-eslint/parser",
  // TODO: Fix tests!
  ignorePatterns: [
    "jest.config.cjs",
    ".eslintrc.cjs",
    "dist/**/*",
    "src/**/*.test.ts",
    // "auto-generated" files
    "e2ehistory.ts",
    "pointsHistory.ts",
    "src/**/mocks/replay.ts",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    /**
     * I disable both node and browser because I dont allow to use anything that relies on a
     * specific environment. If you want to use something that is not common to ALL environments
     * you MUST use them in a highly controlled manner via some kind of "driver" such as my
     * BrowserDriver class.
     */
    "browser": false,
    "node": false
  },
  globals: {
    // console exists in both browser and Node.
    "console": "readonly",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  plugins: [
    "import",
    "@typescript-eslint"
  ],
  settings: {
    'import/resolver': {
      /**
       * eslint-import-resolver-typescript make eslint understand imports better.
       * even though typescript is an empty object it needs to be there for
       * eslint-import-resolver-typescript to do it's thing.
       */
      typescript: {}
    },
  },
  rules: {
    /****************************
     * Warning that are fixable *
     ****************************/
    /**
     * Default
     */
    "arrow-spacing": "warn",
    "eqeqeq": "warn",
    "indent": ["warn", 3, { "SwitchCase": 1 }],
    "no-unneeded-ternary": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-rename": "warn",
    "no-var": "warn",
    "prefer-const": "warn",
    "semi": "warn",
    "no-undef": "error",
    "quotes": ["warn", "double", { "allowTemplateLiterals": true }],
    /**
     * Import
     */
    "import/order": ["warn", {
      "groups": [
        [ "type" ],
        [ "builtin", "external" ],
        [ "internal", "parent", "sibling", "index", "object" ],
      ],
      "newlines-between": "always-and-inside-groups"
    }],
    "import/newline-after-import": "warn",
    /**
     * Typescript
     */

    /**********
     * Errors *
     **********/
    /**
     * Default
     */
    "max-len": ["error", 100],
    "max-lines": ["error", 360],
    /**
     * Import
     */
    "import/no-unresolved": "error",
    "import/named": "error",
    "import/default": "error",
    "import/namespace": "error",
    "import/no-self-import": "error",
    "import/no-cycle": ["error", { "ignoreExternal": true }],
    "import/no-useless-path-segments": "error",
    "import/export": "error",
    "import/no-named-as-default-member": "error",
    "import/no-extraneous-dependencies": "error",
    //     "import/no-unused-modules": ["error", {
    //       "missingExports": true,
    //       "unusedExports": true,
    //       "ignoreExports": ["src/main.ts"]
    //     }],
    "import/no-nodejs-modules": "error",
    "import/no-duplicates": "error",
    "import/no-namespace": "error",
    "import/extensions": [
      "error",
      "never",
      { "json": "always" }
    ],
    "import/no-default-export": "error",
    /**
     * Typescript
     */
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-member-accessibility": ["error"],

    /************
     * Disables *
     ************/
    /**
     * Typescript
     */
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off"
  }
};