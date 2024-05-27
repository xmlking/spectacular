/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    es2017: true,
    node: true,
  },
  ignorePatterns: ['node_modules/', 'dist'],
};
