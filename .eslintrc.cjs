module.exports = {
  // "extends": "eslint:recommended",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: [
     "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  plugins: [
    "import",
    "@typescript-eslint"
  ],
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
    //       "ignoreExports": ["src/main.js"]
    //     }],
    "import/no-nodejs-modules": "error",
    "import/no-duplicates": "error",
    "import/no-namespace": "error",
    "import/extensions": ["error", "always"],
    "import/no-default-export": "error",
    /**
     * Typescript
     */

    /************
     * Disables *
     ************/
    
  }
};