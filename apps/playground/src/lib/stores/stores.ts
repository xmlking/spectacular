import { browser } from '$app/environment';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

// Svelte Writable Stores ---

// Set within the root layout, set TRUE if served in Vercel production mode
export const storeVercelProductionMode: Writable<boolean> = writable(false);
// Session based theme store. Grabs the current theme from the current body.
export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton');

// Local Storage Stores ---

// Persists the tab selection for the user's preferred onboarding method
export const storeOnboardMethod: Writable<string> = localStorageStore('storeOnboardMethod', 'cli');
