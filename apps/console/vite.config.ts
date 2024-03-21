import * as child_process from 'node:child_process';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { paraglide } from '@inlang/paraglide-js-adapter-sveltekit/vite';
import houdini from 'houdini/vite';

// if (!existsSync('./../../infra/base/traefik/certs/traefik.me.crt')) {
// 	console.log('Missing HTTPS key/cert. You may need to run:  npm run cert');
// }

export default defineConfig({
	server: {
		host: 'console.traefik.me',
		// host: 'console-192-168-50-34.traefik.me',
		https: {
			cert: './../../infra/base/traefik/certs/traefik.me.crt',
			key: './../../infra/base/traefik/certs/traefik.me.key'
		},
		proxy: {}
	},
	plugins: [
		houdini(),
		enhancedImages(),
		sveltekit(),
		purgeCss(),
		paraglide({
			project: './project.inlang',
			outdir: './src/i18n'
		})
	],
	define: {
		// to burn-in release version in the footer.svelte
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
		// fallback values: BUILD_VERSION and BUILD_TIME are passed as --build-arg to docker build
		__GIT_TAG__: JSON.stringify(
			child_process.execSync('git describe --tags || git rev-parse --short HEAD').toString().trim() ?? process.env.BUILD_VERSION
		),
		__GIT_DATE__: JSON.stringify(
			child_process.execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"').toString().trim() ?? process.env.BUILD_TIME
		)
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	// Ref: https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
	// Ref: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies
	optimizeDeps: {
		include: ['@spectacular/skeleton']
	},
	build: {
		commonjsOptions: {
			include: [/@spectacular-skeleton/, /node_modules/]
		}
	}
});
