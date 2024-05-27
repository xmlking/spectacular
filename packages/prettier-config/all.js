/** @type {import("prettier").Config} */
module.exports = {
  tabWidth: 2,
  singleQuote: true,
  printWidth: 120,
  plugins: [
    'prettier-plugin-svelte',
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-packagejson',
  ],
  overrides: [
    {
      files: '*.ts',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        svelteIndentScriptAndStyle: false,
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: {
        tabWidth: 2,
        bracketSpacing: false,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],

  astroAllowShorthand: false,
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'strict',
};
