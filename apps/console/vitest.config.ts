import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // svelte({ hot: !process.env.VITEST }),
    sveltekit(),
    svelteTesting(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    exclude: [...configDefaults.exclude, '**/tests/**'],
  },
});
