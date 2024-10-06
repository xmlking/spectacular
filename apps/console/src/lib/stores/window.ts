import { writable } from 'svelte/store';

export const online = writable(true);
export const orientation = writable<OrientationType>();
export const size = writable<{ height: number; width: number }>();
