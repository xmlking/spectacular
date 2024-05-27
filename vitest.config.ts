import { configDefaults, defineConfig } from 'vitest/config';

/**
 * Shared Vitest Config
 * https://vitest.dev/guide/workspace.html
 */
export default defineConfig({
  test: {
    // jest like globals
    globals: true,
    // in-source testing
    includeSource: ['src/**/*.{js,ts,svelte}'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // Exclude playwright tests folder
    exclude: [...configDefaults.exclude, 'tests'],
    benchmark: { reporters: ['default'] },
    reporters: ['default'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
    },
  },
});
