import baseConfig from 'tailwind-config/tailwind.skeleton.config';
import type { Config } from 'tailwindcss';

export default {
	content: [...baseConfig.content, './src/**/*.{html,js,svelte,ts}', './themes/**/*.{html,svelte,js,ts}'],
	presets: [baseConfig]
} satisfies Config;
