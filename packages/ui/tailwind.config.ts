import baseConfig from 'tailwind-config/tailwind.config';
import type { Config } from 'tailwindcss';

export default {
	content: [...baseConfig.content, './src/**/*.{html,js,svelte,ts}'],
	presets: [baseConfig]
} satisfies Config;
