import { skeleton } from '@skeletonlabs/tw-plugin';
// import colors from 'tailwindcss/colors';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import { customTheme } from './custom.theme';
// import { join } from 'path';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts,md,svx}',
		'./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}',
		'../../packages/skeleton-ui/components/**/*.{svelte,ts}'
		// join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', 'Inter', ...defaultTheme.fontFamily.sans]
			},
			// colors: {
			// 	// Your preferred accent color. Indigo is closest to Starlight’s defaults.
			// 	accent: colors.indigo
			// }
		}
	},
	plugins: [
		forms,
		typography,
		containerQueries,
		skeleton({
			themes: {
				preset: [
					{ name: 'crimson', enhancements: true },
					{ name: 'gold-nouveau', enhancements: true },
					{ name: 'hamlindigo', enhancements: true },
					{ name: 'modern', enhancements: true },
					{ name: 'rocket', enhancements: true },
					{ name: 'sahara', enhancements: true },
					{ name: 'seafoam', enhancements: true },
					{ name: 'skeleton', enhancements: true },
					{ name: 'vintage', enhancements: true },
					{ name: 'wintry', enhancements: true }
				],
				custom: [customTheme]
			}
		})
	]
} satisfies Config;
