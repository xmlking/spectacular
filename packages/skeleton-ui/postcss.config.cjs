/** @type {import('postcss-load-config').Config} */
module.exports = {
	plugins: [
		require('postcss-import'),
		require('tailwindcss/nesting'),
		require('tailwindcss'),
		require('autoprefixer'),
		require('cssnano')({ preset: 'default' })
	]
};
