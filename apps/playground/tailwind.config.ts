import baseConfig from '@spectacular/skeleton/tailwind.config';
import type { Config } from 'tailwindcss';

export default {
	presets: [baseConfig],
	content: [...baseConfig.content],
} satisfies Config;
