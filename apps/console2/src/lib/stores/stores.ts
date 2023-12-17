import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';

// Svelte Writable Stores ---

// Session based theme store. Grabs the current theme from the current body.
export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton');

// Local Storage Stores ---

// Persists the tab selection for the user's preferred onboarding method
export const storeOnboardMethod: Writable<string> = localStorageStore('storeOnboardMethod', 'cli');
