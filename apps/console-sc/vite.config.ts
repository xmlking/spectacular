import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	// TODO: evaluate if we still need 'vite-tsconfig-paths' as sveltekit can handel this with `Path aliases`.
	// b.t.w packages/ui/tsconfig.json has paths.
	plugins: [enhancedImages(), sveltekit(), purgeCss(), tsconfigPaths({ ignoreConfigErrors: true })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	// Ref: https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
	// Ref: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies
	optimizeDeps: {
		include: ['@spectacular/ui']
	},
	build: {
		commonjsOptions: {
			include: [/@spectacular-ui/, /node_modules/]
		}
	}
});
