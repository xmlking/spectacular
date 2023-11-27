import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE_URL = 'https://xmlking.github.io';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	prefetch: true,
	experimental: {
		devOverlay: false
	},
	integrations: [
		starlight({
			title: 'My Docs',
			description: 'Athena OS, a new pentesting/cybersecurity linux distribution.',
			logo: {
				light: '/src/assets/athena-light-logo.svg',
				dark: '/src/assets/athena-dark-logo.svg'
			},
			head: [
				{
					tag: 'script',
					attrs: {
						async: true,
						src: 'https://www.googletagmanager.com/gtag/js?id=G-4BD76ZZBR6'
					}
				},
				{
					tag: 'script',
					content: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
				  
					gtag('config', 'G-4BD76ZZBR6');`
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: `${SITE_URL}/og.png`
					}
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: `${SITE_URL}/og.png`
					}
				}
			],
			social: {
				'x.com': 'https://x.com/xmlking',
				twitter: 'https://twitter.com/xmlking',
				github: 'https://github.com/withastro/starlight'
			},
			editLink: {
				baseUrl: 'https://github.com/xmlking/my-docs/tree/main'
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Home',
					link: '/'
				},
				{
					label: 'Demo 🚀',
					link: '/user/demo/'
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
			]
		})
	]
});
