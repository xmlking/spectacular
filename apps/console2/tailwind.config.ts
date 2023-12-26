import baseConfig from '@spectacular/skeleton/tailwind.config';
import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

export default {
	presets: [baseConfig],
	content: [...baseConfig.content, './node_modules/layerchart/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				accent: colors.indigo
			},
			fontFamily: {
				heading: "'Sora Variable', sans-serif",
				sans: "'Inter Variable', sans-serif",
				mono: "'JetBrains Mono', monospace",
				serif: "'Roboto Slab Variable', sans-serif"
			}
		}
	},
	plugins: [...baseConfig.plugins, require('svelte-ux/plugins/tailwind.cjs')]
} satisfies Config;
