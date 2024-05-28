import * as child_process from 'node:child_process';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import houdini from 'houdini/vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: 'console.traefik.me',
    // host: 'console-192-168-XX-XX.traefik.me',
    https: {
      cert: './../../infra/base/traefik/certs/traefik.me.crt',
      key: './../../infra/base/traefik/certs/traefik.me.key',
    },
    proxy: {},
  },
  plugins: [
    houdini(),
    enhancedImages(),
    sveltekit(),
    purgeCss(),
    SvelteKitPWA({
      mode: 'development',
      base: '/',
      scope: '/',
      srcDir: './src',
      // adapterFallback: 'index.html',
      /* enable sw on development */
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
        suppressWarnings: true,
        type: 'module',
        navigateFallback: '/',
      },
      pwaAssets: {
        config: true,
      },
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'safari-pinned-tab.svg',
      ],
      manifest: {
        name: 'spectacular',
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
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
        // globPatterns: ['posts.json', '**/*.{js,css,ico,png,svg,webp,avif,woff,woff2,html}'],
        // globIgnores: ["**/node_modules/**/*", '**/sw*', '**/workbox-*']
        navigateFallbackDenylist: [/^\/auth/, /^\/dashboard/],
      },
      kit: {
        includeVersionFile: true,
      },
    }),
  ],
  define: {
    // Eliminate in-source test code
    'import.meta.vitest': 'undefined',
    // to burn-in release version in the footer.svelte
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    // fallback values: BUILD_VERSION and BUILD_TIME are passed as --build-arg to docker build
    __GIT_TAG__: JSON.stringify(
      child_process.execSync('git describe --tags || git rev-parse --short HEAD').toString().trim() ??
        process.env.BUILD_VERSION,
    ),
    __GIT_DATE__: JSON.stringify(
      child_process.execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"').toString().trim() ??
        process.env.BUILD_TIME,
    ),
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
      exclude: ['src/setupTest.ts', 'src/mocks'],
    },
    deps: {
      // Put Svelte component here, e.g., inline: [/svelte-multiselect/, /msw/]
      inline: [/msw/],
    },
    // Exclude playwright tests folder
    exclude: [...configDefaults.exclude, 'tests'],
  },
  // FIXME: remove fsevents???
  optimizeDeps: {
    exclude: ['fsevents'],
  },
});
