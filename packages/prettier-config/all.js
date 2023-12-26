/** @type {import("prettier").Config} */
module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: '*.ts',
			options: {
				printWidth: 140
			}
		},
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		},
		{
			files: ['*.yaml', '*.yml'],
			options: {
				tabWidth: 2,
				bracketSpacing: false
			}
		},
		{
			files: ['*.md', '*.mdx'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		},
		{
			files: '*.astro',
			options: {
				parser: 'astro'
			}
		}
	],
	tabWidth: 4,
	astroAllowShorthand: false,
	embeddedLanguageFormatting: 'auto',
	htmlWhitespaceSensitivity: 'strict'
};
