module.exports = {
  // "extends": "eslint:recommended",
  parser: "@typescript-eslint/parser",
  // TODO: Fix tests!
  ignorePatterns: [
    "jest.config.cjs",
    ".eslintrc.cjs",
    "dist/**/*",
    "src/**/*test.ts"
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    "browser": true,
    "node": false
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
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "no-unneeded-ternary": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-rename": "warn",
    "no-var": "warn",
    "prefer-const": "warn",
    "semi": "warn",
    "no-undef": "error",
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
    "import/extensions": ["error", "never"],
    "import/no-default-export": "error",
    /**
     * Typescript
     */
    "@typescript-eslint/no-unused-vars": "error",

    /************
     * Disables *
     ************/
    /**
     * Typescript
     */
    "@typescript-eslint/no-unnecessary-type-assertion": "off"
  }
};