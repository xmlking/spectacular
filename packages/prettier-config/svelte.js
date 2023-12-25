module.exports = {
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	],
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	useTabs: true
};
