import baseConfig from '@spectacular/skeleton/tailwind.config';
import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

export default {
	presets: [baseConfig],
	content: [...baseConfig.content, './node_modules/layerchart/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				// Your preferred accent color. Indigo is closest to Starlight’s defaults.
				accent: colors.amber
			}
		}
	},
	plugins: [...baseConfig.plugins /* require('svelte-ux/plugins/tailwind.cjs') */]
} satisfies Config;
