import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  // compilerOptions: { runes: true },
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $i18n: 'src/i18n',
      // NOTE: we are using `exports` in package.json of `@repo/ui` package.
      // so no need to use `@repo/ui/*` alias.
      // '@repo/ui/*': '../../packages/ui/src/*',
    },
    version: {
      name: process.env.npm_package_version,
    },
  },
};

export default config;
