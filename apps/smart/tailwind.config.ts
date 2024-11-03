import baseConfig from '@spectacular/ui/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [baseConfig],
  content: [...baseConfig.content],
};

export default config;
