import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig, defineProject, mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared'; // Adjust path relative to root config

export default defineProject(
  mergeConfig(
    sharedConfig, // Inherit from the root config
    defineConfig({
      plugins: [
        // svelte({ hot: !process.env.VITEST }),
        sveltekit(),
        svelteTesting(),
      ],
      test: {
        environment: 'jsdom', // Set the environment to jsdom for React component testing
        globals: true, // Use global APIs (describe, it, expect, etc.)
        setupFiles: './vitest.setup.ts', // Add setup files if needed (e.g., './vitest.setup.ts')
      },
    })
  )
);
