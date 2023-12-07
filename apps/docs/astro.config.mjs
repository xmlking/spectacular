import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
// import vercel from "@astrojs/vercel/serverless";
import vercel from '@astrojs/vercel/static';

const SITE_URL = 'https://spectacular-docs.vercel.app/';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	integrations: [
		starlight({
			title: 'Docs',
			description: 'Spectacular, a SvelteKit monorepo template project.',
			logo: {
				light: '/src/assets/athena-light-logo.svg',
				dark: '/src/assets/athena-dark-logo.svg'
			},
			head: [
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: SITE_URL + 'og.jpg?v=1'
					}
				},
				{
					tag: 'meta',
					attrs: {
						property: 'twitter:image',
						content: SITE_URL + 'og.jpg?v=1'
					}
				}
			],
			social: {
				'x.com': 'https://x.com/xmlking',
				github: 'https://github.com/xmlking/spectacular'
			},
			editLink: {
				baseUrl: 'https://github.com/xmlking/spectacular/tree/main/apps/docs'
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Home',
					link: '/'
				},
				{
					label: 'Demo 🚀',
					autogenerate: { directory: 'demos' }
				},
				{
					label: 'Introduction',
					autogenerate: { directory: 'guides' }
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
						{ label: 'Configuration', link: '/user/config/' }
					]
				},
				{
					label: 'User guides',
					items: [
						{ label: 'Extension', link: '/user/extension/' },
						{ label: 'Snippet', link: '/user/snippet/' },
						{ label: 'WebPageTest', link: '/user/webpagetest/' },
						{ label: 'BigQuery', link: '/user/bigquery/' }
					]
				},
				{
					label: 'Developer guides',
					items: [
						{ label: 'Contributing to Capo', link: '/developer/contributing/' },
						{ label: 'Installing the extension locally', link: '/developer/crx-local/' }
					]
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', link: '/guides/example/' }
					]
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' }
				},
				{
					label: 'FAQ',
					autogenerate: { directory: 'faq' }
				}
			],
			customCss: [
				// Fontsource files for to regular and semi-bold font weights.
				'@fontsource-variable/inter',
				// Fontsource files for code.
				'@fontsource/source-code-pro',
				// Path to your Tailwind base styles:
				'./src/styles/tailwind.css'
			]
		}),
		tailwind({
			// Disable the default base styles:
			applyBaseStyles: false
		})
	],
	output: 'static',
	adapter: vercel({
		webAnalytics: {
			enabled: true
		},
		speedInsights: {
			enabled: true
		}
	})
});
