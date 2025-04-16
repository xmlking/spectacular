import node from '@astrojs/node';
import { defineConfig, envField, fontProviders } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import starlight from '@astrojs/starlight';
import partytown from '@astrojs/partytown';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';

const SITE_URL = process.env.VERCEL_ENV === 'production' ? process.env.SITE_URL : 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  integrations: [svelte(), starlight({ title: 'Web', disable404Route: true }), partytown(), expressiveCode(), mdx()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Roboto',
        cssVariable: '--font-roboto',
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Inter',
        cssVariable: '--font-inter',
      },
      {
        provider: fontProviders.google(),
        name: 'Source Code Pro',
        cssVariable: '--font-source-code-pro',
        display: 'swap',
        fallbacks: ['monospace'],
        weights: [300, 400, 700],
        optimizedFallbacks: true,
      },
    ],
  },

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

  vite: {
    plugins: [tailwindcss()],
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
