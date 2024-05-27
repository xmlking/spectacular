// DOCS: https://turbo.build/repo/docs/handbook/linting/eslint
// TODO: eslint v9 https://github.com/usagizmo/webapp-template/blob/main/packages/eslint-config/eslint.config.js
/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier', 'turbo'],
  plugins: ['@typescript-eslint', 'unused-imports'],
  ignorePatterns: [
    'node_modules/',
    '.sveltekit/',
    '*.cjs',
    '/apps/**/src/lib/i18n',
    'packages/ui/src/lib/components/ui',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
      'svelte-eslint-parser': ['*.svelte'],
      espree: ['.js', 'jsx', '.cjs', '.mjs'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      extends: [
        // 'plugin:svelte/recommended', // HINT: https://github.com/sveltejs/eslint-plugin-svelte
        'plugin:svelte/prettier',
      ],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.svelte'],
      },
      rules: {
        'svelte/no-at-html-tags': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['*.svelte.js'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.svelte.ts'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      extends: ['eslint:recommended', 'plugin:astro/recommended'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      files: ['**/*.md?(x)'],
      extends: ['plugin:mdx/recommended'],

      settings: {
        'mdx/code-blocks': false,
      },
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'off',
        'mdx/no-unused-expressions': ['off'],
      },
    },
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      /**
       * These rules apply to code blocks in MDX files.
       */
      rules: {
        'no-unused-vars': ['off'],
        '@typescript-eslint/no-unused-vars': ['warn'],
        'no-undef': ['off'],
      },
    },
    {
      // Define the configuration for `<script>` tag.
      // Script in `<script>` is assigned a virtual file name with the `.js` extension.
      files: ['**/*.astro/*.js', '*.astro/*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte', '.astro'],
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // 'error', // lets infer from typescript

    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/no-unresolved': 'off', // It's hard to solve...
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '$*/**',
            group: 'parent',
            position: 'before',
          },
          {
            pattern: '$houdini',
            group: 'parent',
            position: 'before',
          },
        ],
      },
    ],
  },

  globals: {
    __APP_VERSION__: true,
    __GIT_TAG__: true,
    __GIT_DATE__: true,
  },
};
