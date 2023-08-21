import { writable } from 'svelte/store';

// used to toggle the visibility of the sidebar
export const sidebarOpen = writable(true);
