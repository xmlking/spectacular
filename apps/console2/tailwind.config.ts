import baseConfig from '@spectacular/skeleton/tailwind.config';
import type { Config } from 'tailwindcss';

export default {
	presets: [baseConfig],
	content: [...baseConfig.content],
	theme: {
		extend: {
			fontFamily: {
				heading: "'Sora Variable', sans-serif",
				sans: "'Inter Variable', sans-serif",
				mono: "'JetBrains Mono', monospace",
				serif: "'Roboto Slab Variable', sans-serif"
			}
		}
	}
} satisfies Config;
