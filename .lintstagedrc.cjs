/* jshint esversion: 9 */

module.exports = {
	'*.{js,ts,json,svelte}': ['pnpm run format', 'git add'],
	'./src/**/*.{svelte,ts}': ['pnpm run format', 'git add', 'pnpm run lint:fix'],
	'./.{ts,cjs,js}': ['pnpm run lint:fix']
};
