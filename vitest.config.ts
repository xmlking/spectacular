import { defineConfig } from 'vitest/config';

/**
 * Root Vitest Config
 * https://vitest.dev/guide/projects
 */
export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
    coverage: {
      provider: 'v8',
    },
  },
});
