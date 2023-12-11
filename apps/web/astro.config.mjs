import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

const SITE_URL =
	process.env.VERCEL_ENV === 'production' ? process.env.SITE_URL : 'http://localhost:4321/';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	integrations: [
		tailwind({
			// Disable the default base styles:
			// Example: Disable injecting a basic `base.css` import on every page.
			// Useful if you need to define and/or import your own custom `base.css`.
			applyBaseStyles: false
		}),
		svelte(),
		sitemap(),
		partytown(),
		mdx()
	],
	output: 'hybrid',
	adapter: vercel({
		webAnalytics: {
			enabled: true
		},
		speedInsights: {
			enabled: true
		}
	})
});
