module.exports = {
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        svelteIndentScriptAndStyle: false,
      },
    },
  ],
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss', 'prettier-plugin-packagejson'],
  printWidth: 120,
  singleQuote: true,
};
