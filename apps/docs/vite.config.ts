import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { imagetools } from 'vite-imagetools';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { defineConfig } from 'vite';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

export default defineConfig({
	clearScreen: false,
	define: {
		'process.env.VITE_SVELTEKIT_VERSION': JSON.stringify(String(pkg.devDependencies['@sveltejs/kit'])),
		'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString())
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
			$sveltin: path.resolve('./src/sveltin'),
			$config: path.resolve('./config'),
			$content: path.resolve('./content'),
			$data: path.resolve('./data'),
			$themes: path.resolve('./themes')
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
	],
	ssr: { noExternal: ['@indaco/svelte-iconoir/**'] }
});
