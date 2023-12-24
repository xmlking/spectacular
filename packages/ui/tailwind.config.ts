import baseConfig from '@spectacular/tailwind-config/tailwind.skeleton.config';
import type { Config } from 'tailwindcss';

export default {
	content: [...baseConfig.content, './src/**/*.{html,js,svelte,ts}'],
	presets: [baseConfig]
} satisfies Config;
