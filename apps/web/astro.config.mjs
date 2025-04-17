// @ts-check
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import partytown from '@astrojs/partytown';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, envField, fontProviders } from 'astro/config';

const VERCEL_SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const site = VERCEL_SITE_URL ?? process.env.GH_SITE_URL ?? 'http://localhost:4321';
const base = process.env.GITHUB_ACTIONS ? (process.env.GH_BASE_PATH ?? '/spectacular') : undefined;

console.log('which runtime?', { site, base });
// https://astro.build/config
export default defineConfig({
  site,
  base,

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

  adapter: process.env.VERCEL
    ? vercel({
        webAnalytics: {
          enabled: true,
        },
      })
    : process.env.GITHUB_ACTIONS
      ? undefined
      : node({
          mode: 'standalone',
        }),

  vite: {
    plugins: [tailwindcss()],
  },
});
