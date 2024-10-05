// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    "vite.config.ts",
    ".eslintrc.cjs",
    "dist/**/*",
    // "src/**/*.test.ts",
    // "auto-generated" files
    "e2ehistory.ts",
    "src/**/mocks/replay.ts",
    "**/*.d.ts",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
    ecmaVersion: "latest", // https://github.com/sindresorhus/eslint-plugin-unicorn
    sourceType: "module", // https://github.com/sindresorhus/eslint-plugin-unicorn
  },
  env: {
    "es2024": true, // https://github.com/sindresorhus/eslint-plugin-unicorn
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
    // console exists in browser, Node and Deno.
    "console": "readonly",
    // setTimeout exists in browser, Node and Deno.
    "setTimeout": "readonly",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  plugins: [
    "import",
    "@typescript-eslint",
    "unicorn",
  ],
  settings: {
    'import/resolver': {
      node: {
        // extensions: ['.js', '.ts', '.tsx'],
        paths: 'src',
        "map": [
          ["@", "./src"]
        ]
      },
      /**
       * eslint-import-resolver-typescript make eslint understand imports better.
       * even though typescript is an empty object it needs to be there for
       * eslint-import-resolver-typescript to do it's thing.
       */
      typescript: {}
    },
  },
  rules: {
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
    "max-len": ["error", 100],
    "max-lines": ["error", 360],

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
      "always",
      { "json": "always" }
    ],
    "import/no-default-export": "error",
  
    /**
     * Typescript
     */
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
    "@typescript-eslint/explicit-member-accessibility": ["error"],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-assertions": ["error" , {
      assertionStyle: "as",
      objectLiteralTypeAssertions: "never"
    }],
    "@typescript-eslint/no-duplicate-type-constituents": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/switch-exhaustiveness-check": ["error", { requireDefaultForNonUnion: true }],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/no-loop-func": "error",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true }],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/no-confusing-void-expression": "error",
    // "@typescript-eslint/no-dynamic-delete": "error",// sometimes Map is faster than object delete
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-meaningless-void-operator": "error",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    // "@typescript-eslint/no-non-null-assertion": "error", // currently too harsh.
    // "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    // "@typescript-eslint/no-unnecessary-condition": "error", // too harsh for someArray[i].
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-return-this-type": "error",
    "@typescript-eslint/only-throw-error": "error",
    "@typescript-eslint/no-extraneous-class": "error",
    // "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/no-unsafe-enum-comparison": "error",
    "@typescript-eslint/no-unsafe-unary-minus": "error",
    "@typescript-eslint/prefer-promise-reject-errors": "error",
    "@typescript-eslint/prefer-find": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/no-unsafe-function-type": "error",
    "@typescript-eslint/no-wrapper-object-types": "error",
    "@typescript-eslint/no-empty-object-type": "error",
    
    /**
     * Unicorn
    */
    "unicorn/consistent-function-scoping": "error", // performance
    "unicorn/no-array-for-each": "error", // performance
    "unicorn/no-array-reduce": "error", // performance
    "unicorn/no-for-loop": "error",
    "unicorn/prefer-modern-math-apis": "error",
    "unicorn/prefer-node-protocol": "error",

    /************
     * Disables *
     ************/
    /**
     * Typescript
     */
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    "@typescript-eslint/dot-notation": "off",
  }
});