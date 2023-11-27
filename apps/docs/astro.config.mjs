import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

const SITE_URL = 'https://xmlking.github.io';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs with Tailwind',
			social: {
				'x.com': 'https://x.com/xmlking',
				github: 'https://github.com/withastro/starlight'
			},
			sidebar: [
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
				}
			],
			customCss: ['./src/styles/global.css']
		}),
		tailwind({ applyBaseStyles: false })
	]
});
