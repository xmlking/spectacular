import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit(),
  paraglide({
    project: './project.inlang',
    outdir: './src/i18n',
  })
  ],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
