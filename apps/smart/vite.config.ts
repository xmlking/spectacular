import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    tailwindcss(),
    enhancedImages(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/i18n',
      strategy: ['url', 'cookie', 'baseLocale'],
    }),
    // svelte({ hot: !process.env.VITEST }),
    sveltekit(),
  ],
  define: {
    __NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    projects: [
      {
        extends: './vite.config.ts',
        plugins: [svelteTesting()],
        test: {
          name: 'client',
          environment: 'jsdom',
          clearMocks: true,
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          // Add @testing-library/jest-dom's matchers & mocks of SvelteKit modules
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        },
      },
    ],
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
