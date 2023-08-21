import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import houdini from 'houdini/vite';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { UserConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// Get current tag/commit and last commit date from git
const pexec = promisify(exec);

const [gitTag, gitDate] = (
	await Promise.allSettled([
		pexec('git describe --tags || git rev-parse --short HEAD'),
		pexec('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"')
	])
).map((v) =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	JSON.stringify(v.value?.stdout.trim())
);

const config: UserConfig = {
	plugins: [
		houdini(),
		sveltekit(),
		SvelteKitPWA({
			// adapterFallback: 'index.html',
			base: '/',
			scope: '/',
			/* enable sw on development */
			devOptions: {
				enabled: process.env.SW_DEV === 'true',
				suppressWarnings: true,
				type: 'module',
				navigateFallback: '/'
			},
			includeAssets: [
				'favicon.ico',
				'favicon.svg',
				'favicon-16x16.png',
				'favicon-32x32.png',
				'apple-touch-icon.png',
				'safari-pinned-tab.svg'
			],
			manifest: {
				name: 'svelte-starter-kit',
				short_name: 'Svelte Starter Kit',
				description: 'Svelte starter template project',
				lang: 'en',
				scope: '/',
				start_url: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				// globPatterns: ['posts.json', '**/*.{js,css,ico,png,svg,webp,avif,woff,woff2,html}'],
				// globIgnores: ["**/node_modules/**/*", '**/sw*', '**/workbox-*']
				navigateFallbackDenylist: [/^\/auth/, /^\/dashboard/]
			}
		})
	],
	define: {
		// Eliminate in-source test code
		'import.meta.vitest': 'undefined',
		// to burn-in release version in the footer.svelte
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
		// fallback values: BUILD_VERSION and BUILD_TIME are passed as --build-arg to docker build
		__GIT_TAG__: gitTag ?? JSON.stringify(process.env.BUILD_VERSION),
		__GIT_DATE__: gitDate ?? JSON.stringify(process.env.BUILD_TIME)
	},
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		// Add @testing-library/jest-dom matchers & setup MSW
		setupFiles: ['./src/setupTest.ts', './src/mocks/setup.ts'],
		// Exclude files in c8
		coverage: {
			exclude: ['src/setupTest.ts', 'src/mocks']
		},
		deps: {
			// Put Svelte component here, e.g., inline: [/svelte-multiselect/, /msw/]
			inline: [/msw/]
		},
		// Exclude playwright tests folder
		exclude: [...configDefaults.exclude, 'tests']
	},
	// FIXME: remove fsevents???
	optimizeDeps: {
		exclude: ['fsevents']
	}
};

export default config;
