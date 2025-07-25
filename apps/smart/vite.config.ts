import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { coverageConfigDefaults } from 'vitest/config';
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
    devtoolsJson(),
  ],
  define: {
    __NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    projects: [
      {
        // Client-side tests (Svelte components)
        extends: './vite.config.ts',
        test: {
          name: 'client',
          environment: 'browser',
          // Timeout for browser tests - prevent hanging on element lookups
          testTimeout: 2000,
          browser: {
            enabled: true,
            provider: 'playwright',
            // Multiple browser instances for better performance
            // Uses single Vite server with shared caching
            instances: [
              { browser: 'chromium' },
              // { browser: 'firefox' },
              // { browser: 'webkit' },
            ],
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**', 'src/**/*.ssr.{test,spec}.{js,ts}'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
      {
        // SSR tests (Server-side rendering)
        extends: './vite.config.ts',
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
      {
        // Server-side tests (Node.js utilities)
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
    ],
    coverage: {
      all: true,
      reporter: ['text-summary', 'html'],
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/config.{js,ts,cjs}',
        '**/*.config.{js,ts,cjs}',
        '**/+page.svelte',
        '**/+layout.svelte',
        '**/+error.svelte',
        '.svelte-kit/**',
        'build/**',
        'static/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        '**/types/**',
      ],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: 'some',
            },
          ],
        },
      },
    },
    // build: {
    // 	commonjsOptions: {
    // 		include: [/@repo-ui/, /node_modules/],
    // 	},
  },
  experimental: {
    enableNativePlugin: true,
  },
  esbuild: false,
});
