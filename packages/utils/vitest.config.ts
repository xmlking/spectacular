import { defineConfig, defineProject, mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.js';

export default defineProject(
  mergeConfig(
    sharedConfig,
    defineConfig({
      test: {
        environment: 'node',
        includeSource: ['src/**/*.{js,ts}'],
        include: ['src/**/*.{test,spec}.{js,ts}'],
        testTimeout: 180000,
      },
    })
  )
);
