import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

const SITE_URL = process.env.VERCEL_ENV === 'production' ? process.env.SITE_URL : 'http://localhost:4321/';

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
});
