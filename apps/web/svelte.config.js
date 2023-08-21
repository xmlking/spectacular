import adapter from '@sveltejs/adapter-node';
// import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	// The Svelte Inspector
	// Usage: open up your project in the browser. Then use the key combo Command + Shift to activate
	vitePlugin: {
		inspector: true
	},

	kit: {
		adapter: adapter({
			// HINT: need nodejs > v19 runtime
			polyfill: false
		}),

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
