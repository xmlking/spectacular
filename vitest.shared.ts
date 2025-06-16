import { configDefaults, defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Shared Vitest Config
 */
export default defineConfig({
  // plugins: [tsconfigPaths()],
  test: {
    // jest like globals (describe, it, expect, etc.)
    globals: true,
    // in-source testing
    includeSource: ['src/**/*.{js,ts,svelte}'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // Exclude playwright tests folder
    exclude: [...configDefaults.exclude, 'e2e'],
    benchmark: { reporters: ['default'] },
    reporters: ['default'],
    passWithNoTests: true,
    hookTimeout: 5000,
    testTimeout: 5000,
  },
});
