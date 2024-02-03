import { localStorageStore } from '@skeletonlabs/skeleton';
import { derived, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { page } from '$app/stores';

// Svelte Writable Stores ---

// Set within the root layout, set TRUE if served in Vercel production mode
export const storeVercelProductionMode: Writable<boolean> = writable(false);
// Session based theme store. Grabs the current theme from the current body.
export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton');

// Local Storage Stores ---

// Persists the tab selection for the user's preferred onboarding method
export const storeOnboardMethod: Writable<string> = localStorageStore('storeOnboardMethod', 'cli');

/**
 * Narrowing reactivity scope.
 */
export const lang = derived(page, ($page) => $page.data.lang);

/**
 * current scrollLeft and scrollTop values
 */
export const scroll = writable<{ x: number; y: number }>({ x: 0, y: 0 });
