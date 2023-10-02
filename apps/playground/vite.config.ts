import * as child_process from 'node:child_process';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

// const path = fileURLToPath(new URL('package.json', import.meta.url));
// const pkg = JSON.parse(readFileSync(path, 'utf8'));
// __APP_VERSION__: JSON.stringify(pkg.version),

export default defineConfig({
	plugins: [sveltekit(), imagetools(), purgeCss()],
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
		noExternal: ['tsparticles', 'tsparticles-slim', 'tsparticles-engine', 'svelte-particles']
	}
});
