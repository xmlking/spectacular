/* jshint esversion: 9 */

module.exports = {
	'*.{js,ts,json,svelte}': ['pnpm format', 'git add'],
	'./src/**/*.{svelte,ts}': ['pnpm format', 'git add', 'pnpm lint:fix'],
	'./.{ts,cjs,js}': ['pnpm lint:fix']
};
