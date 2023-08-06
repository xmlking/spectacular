import type { Config } from 'tailwindcss';
import baseConfig from 'tailwind-config/tailwind.config';

export default {
  content: [
    './components/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  presets: [baseConfig]
} satisfies Config;
