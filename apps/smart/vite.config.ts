import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    enhancedImages(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/i18n',
      strategy: ['url', 'cookie', 'baseLocale'],
    }),
    sveltekit(),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  optimizeDeps: {
    include: ['@repo/ui'],
  },
  build: {
    commonjsOptions: {
      include: [/@repo-ui/, /node_modules/],
    },
  },
});
