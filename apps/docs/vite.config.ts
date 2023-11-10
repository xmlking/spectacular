import * as child_process from 'node:child_process';
import path from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { imagetools } from 'vite-imagetools';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { defineConfig } from 'vite';

export default defineConfig({
	clearScreen: false,
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
	ssr: {
		// add all tsparticles libraries here, they're not made for SSR, they're client only
		noExternal: ['@indaco/svelte-iconoir/**']
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			// Alternatevaly set server.fs.strict to false
			allow: ['..']
		}
	},
	resolve: {
		alias: {
			$config: path.resolve('./config'),
			$content: path.resolve('./content')
		}
	},
	plugins: [
		sveltekit(),
		imagetools(),
		purgeCss(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: false,
			scope: '/',
			workbox: {
				globPatterns: ['posts.json', '**/*.{js,css,html,svg,ico,png,webp,avif}'],
				globIgnores: ['**/sw*', '**/workbox-*']
			}
		})
	]
});
