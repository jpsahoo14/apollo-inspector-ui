module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended', 
      // 'plugin:@typescript-eslint/recommended', 
      // 'plugin:react/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      /** Added a few rules for example
       * "no-console": "warn",
       *  "eqeqeq": "error",
       * "@typescript-eslint/no-unused-vars": "warn",
       * "semi": ["error", "always"]
       **/
    },
  };
