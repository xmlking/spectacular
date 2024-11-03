import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from "@sveltejs/enhanced-img";

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
    paraglide({
      project: './project.inlang',
      outdir: './src/i18n',
    })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  optimizeDeps: {
    include: ['@spectacular/ui'],
  },
  build: {
    commonjsOptions: {
      include: [/@spectacular-ui/, /node_modules/],
    },
  },
});
