import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/kit/vite';
import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-auto';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	// TODO: add `preserve: ['ld+json']` like in `svelte-preprocess`
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],

	// The Svelte Inspector
	// Usage: open up your project in the browser. Then use the key combo Command + Shift to activate
	vitePlugin: {
		inspector: true
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: process.env.VERCEL
			? adapterAuto()
			: adapterStatic({
					// default options are shown
					pages: 'build',
					assets: 'build',
					fallback: '200.html',
					precompress: true
			  }),
		prerender: {
			handleMissingId: 'warn',
			crawl: true,
			entries: ['*']
		},
		output: {
			preloadStrategy: 'preload-mjs'
		},
		version: {
			name: process.env.npm_package_version
		},
		csp: {
			mode: 'auto',
			directives: {
				'style-src': ['self', 'unsafe-inline', 'https://giscus.app']
			}
		}
	}
};
export default config;
