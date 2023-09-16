/* jshint esversion: 9 */

module.exports = {
	'*.{js,ts,json,svelte}': ['bun run format', 'git add'],
	'./src/**/*.{svelte,ts}': ['bun run format', 'git add', 'bun run lint:fix'],
	'./.{ts,cjs,js}': ['bun run lint:fix']
};
