import type { Config } from 'tailwindcss';
import baseConfig from 'tailwind-config/tailwind.config';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts,mdx}',
		'../../packages/ui/src/**/*.{html,js,svelte,ts,mdx}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	presets: [baseConfig],
	darkMode: 'class'
} satisfies Config;
