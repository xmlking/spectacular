import node from '@astrojs/node';
import starlight from '@astrojs/starlight';
// import vercel from "@astrojs/vercel/serverless";
import vercel from '@astrojs/vercel/static';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';

/* https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables */
/* https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables */
const VERCEL_SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const site = VERCEL_SITE_URL ?? process.env.GH_SITE_URL ?? 'http://localhost:4321';
const base = process.env.GITHUB_ACTIONS ? (process.env.GH_BASE_PATH ?? '/spectacular') : undefined;

console.log('which runtime?', { site, base });
// https://astro.build/config
export default defineConfig({
  site,
  base,

  markdown: {
    // Applied to .md and .mdx files
    rehypePlugins: [rehypeMermaid],
  },

  integrations: [
    starlight({
      title: 'Docs',
      description: 'Spectacular, a SvelteKit monorepo template project.',
      logo: {
        light: '/src/assets/astro-logo-dark.svg',
        dark: '/src/assets/astro-logo-light-gradient.svg',
      },
      head: [
        // {
        // 	tag: 'script',
        // 	attrs: {
        // 		async: true,
        // 		src: 'https://www.googletagmanager.com/gtag/js?id=G-4BD76ZZBR6'
        // 	}
        // },
        // {
        // 	tag: 'script',
        // 	content: `
        // 	window.dataLayer = window.dataLayer || [];
        // 	function gtag(){dataLayer.push(arguments);}
        // 	gtag('js', new Date());

        // 	gtag('config', 'G-4BD76ZZBR6');`
        // },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: `${site}/og.jpg?v=1`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'twitter:image',
            content: `${site}/og.jpg?v=1`,
          },
        },
      ],
      social: [
        { icon: 'x.com', label: 'X', href: 'https://x.com/xmlking' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/xmlking/spectacular' },
      ],
      editLink: {
        baseUrl: 'https://github.com/xmlking/spectacular/tree/main/apps/docs',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Demo 🚀',
          autogenerate: { directory: 'demos' },
        },
        {
          label: 'Introduction',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Getting started',
          items: [
            { label: 'Quick start', link: '/user/quick-start/' },
            { label: 'Rules', link: '/user/rules/' },
            { label: 'Improve performance', link: '/user/performance/' },
            { label: 'Interpret results', link: '/user/actionability/' },
            { label: 'Static vs dynamic assessment', link: '/user/assessment-mode/' },
            { label: 'Validation', link: '/user/validation/' },
            { label: 'Configuration', link: '/user/config/' },
            { label: 'Custom Page', link: '/custom/example' },
          ],
        },
        {
          label: 'User guides',
          items: [
            { label: 'Extension', link: '/user/extension/' },
            { label: 'Snippet', link: '/user/snippet/' },
            { label: 'WebPageTest', link: '/user/webpagetest/' },
            { label: 'BigQuery', link: '/user/bigquery/' },
          ],
        },
        {
          label: 'Developer guides',
          items: [
            { label: 'Contributing to Capo', link: '/developer/contributing/' },
            {
              label: 'Installing the extension locally',
              link: '/developer/crx-local/',
            },
          ],
        },
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', link: '/guides/example/' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        {
          label: 'FAQ',
          autogenerate: { directory: 'faq' },
        },
      ],
      customCss: [
        // Fontsource files for to regular and semi-bold font weights.
        '@fontsource-variable/inter',
        // Fontsource files for code.
        '@fontsource/source-code-pro',
      ],
    }),
  ],

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
    : process.env.GITHUB_ACTIONS
      ? undefined
      : node({
          mode: 'standalone',
        }),

  vite: {
    plugins: [tailwindcss()],
  },
});
