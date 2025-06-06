import * as child_process from 'node:child_process';
import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { vercelToolbar } from '@vercel/toolbar/plugins/vite';
import houdini from 'houdini/vite';
import { defineConfig } from 'vitest/config';

// if (!existsSync('config/certs/traefik.me.crt')) {
// 	console.log('Missing HTTPS key/cert. You may need to run:  npm run cert');
// }
// TODO Lightning CSS  and tailwind v4 https://twitter.com/devongovett/status/1701097560155549756

export default defineConfig({
  server: {
    host: 'console.traefik.me',
    // host: 'console-192-168-XX-XX.traefik.me',
    https: {
      cert: 'config/certs/traefik.me.crt',
      key: 'config/certs/traefik.me.key',
    },
    proxy: {},
  },
  plugins: [
    houdini(),
    enhancedImages(),
    sveltekit(),
    paraglide({
      project: './project.inlang',
      outdir: './src/i18n',
      // experimentalUseVirtualModules: true, // TODO not working with svelte 4
    }),
    vercelToolbar(),
  ],
  define: {
    // to burn-in release version in the footer.svelte
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    // fallback values: BUILD_VERSION and BUILD_TIME are passed as --build-arg to docker build
    __GIT_TAG__: JSON.stringify(
      child_process.execSync('git describe --tags || git rev-parse --short HEAD').toString().trim() ??
        process.env.BUILD_VERSION
    ),
    __GIT_DATE__: JSON.stringify(
      child_process.execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"').toString().trim() ??
        process.env.BUILD_TIME
    ),
  },
  // ssr: {
  //     noExternal: ['@nhost/nhost-js', 'graphql'],
  // },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  // Ref: https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
  // Ref: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies
  // optimizeDeps: {
  //   include: ['@repo/skeleton'],
  // },
  // build: {
  //   commonjsOptions: {
  //     include: [/@repo-skeleton/, /node_modules/],
  //   },
  // },
});
