import adapterNode from '@sveltejs/adapter-node';
import adapterAuto from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	// The Svelte Inspector
	// Usage: open up your project in the browser. Then use the key combo Command + Shift to activate
	vitePlugin: {
		inspector: true
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: process.env.VERCEL ? adapterAuto() : adapterNode({ polyfill: false }),
		// When hosting SPA on GitHub Pages
		paths: {
			// base: dev ? '' : '/hc360-ui',
			// relative: false
		},
		output: {
			preloadStrategy: 'preload-mjs'
		},

		// prerender: { entries: [] },
		alias: {
			$mocks: 'src/mocks',
			$houdini: './$houdini'
		}
	}
};
export default config;
