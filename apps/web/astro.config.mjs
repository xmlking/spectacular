import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, envField } from 'astro/config';

const SITE_URL = process.env.VERCEL_ENV === 'production' ? process.env.SITE_URL : 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    starlight({ title: 'Web' }),
    tailwind({
      // Disable the default base styles:
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    svelte(),
    sitemap(),
    partytown(),
    expressiveCode(),
    mdx(),
  ],
  output: 'hybrid',
  // HINT: To set build output, same way like sveltekit for Dockerfile
  build: {
    server: './build',
    client: './build/client',
    serverEntry: 'index.js',
  },
  adapter: process.env.VERCEL
    ? vercel({
        webAnalytics: {
          enabled: true,
        },
        speedInsights: {
          enabled: true,
        },
      })
    : node({
        mode: 'standalone',
      }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  experimental: {
    serverIslands: true,
    clientPrerender: true,
    env: {
      schema: {
        API_VERSION: envField.enum({
          context: 'server',
          access: 'secret',
          values: ['v1', 'v2'],
          optional: true,
        }),
        API_PORT: envField.number({
          context: 'server',
          access: 'secret',
          gt: 1024,
          default: 7000,
        }),
        PUBLIC_SOME_SERVER_FEATURE_FLAG: envField.boolean({
          context: 'server',
          access: 'public',
          default: false,
        }),
        PUBLIC_SOME_CLIENT_FEATURE_FLAG: envField.boolean({
          context: 'client',
          access: 'public',
          default: false,
        }),
      },
    },
  },
});
