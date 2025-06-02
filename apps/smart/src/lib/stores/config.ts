import type { Style } from '$lib/registry/styles.js';
import type { Theme } from '$lib/registry/themes.js';
import { persisted } from 'svelte-persisted-store';

type Config = {
  style: Style['name'];
  theme: Theme['name'];
  radius: number;
};

export const config = persisted<Config>('config', {
  style: 'default',
  theme: 'zinc',
  radius: 0.5,
});
