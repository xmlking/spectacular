import adapterNode from '@sveltejs/adapter-node';
import adapterAuto from '@sveltejs/adapter-auto';
import adapterBun from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
		adapter: process.env.VERCEL
			? adapterAuto()
			: process.env.BUN_ENV
				? adapterBun()
				: adapterNode({ polyfill: false }),
		prerender: { crawl: false }, // FIXME: remove after all links are corrected.
		output: {
			preloadStrategy: 'preload-mjs'
		},
		version: {
			name: process.env.npm_package_version
		},
		alias: {
			$i18n: 'src/i18n'
			// TODO: This alias should not be needed, but without it, VSCode show `Cannot find module` error!!!
			// Ref: https://github.com/vercel/turbo/discussions/620
			// 	"@spectacular/skeleton/components/*": "../../packages/skeleton-ui/components/*"
		}
		// env: {
		// 	dir: '../..',
		// 	privatePrefix: 'PRIVATE_',
		// 	publicPrefix: 'PUBLIC_'
		// }
	}
};
export default config;
