import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

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
  plugins: [enhancedImages(), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  // Ref: https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
  // Ref: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies
  optimizeDeps: {
    include: ['@spectacular/ui'],
  },
  build: {
    commonjsOptions: {
      include: [/@spectacular-ui/, /node_modules/],
    },
  },
});
