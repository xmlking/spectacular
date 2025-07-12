import type { Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';
import { browser } from '$app/environment';
import { page } from '$app/stores';

// Svelte Writable Stores ---

// Set within the root layout, set TRUE if served in Vercel production mode
export const storeVercelProductionMode: Writable<boolean> = writable(false);
// Session based theme store. Grabs the current theme from the current body.
export const storeTheme = writable(browser ? (document.body.getAttribute('data-theme') ?? '') : 'skeleton');

// Local Storage Stores ---

// Persists the tab selection for the user's preferred onboarding method
export const storeOnboardMethod = persisted('storeOnboardMethod', 'cli');

/**
 * Narrowing reactivity scope.
 */
export const lang = derived(page, ($page) => $page.data.lang);

/**
 * current scrollLeft and scrollTop values
 */
export const scroll = writable<{ x: number; y: number }>({ x: 0, y: 0 });

/**
 * Cloudflare Turnstile state
 * Ref: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 * default value is a dummy token to bypass the turnstile when this feature is disabled
 * ie., when `FEATURE_SHOW_BOT_PROTECTION = false`
 */
export const turnstileResponse = writable<string>('XXXX.DUMMY.TOKEN.XXXX');
export const turnstilePassed = writable<boolean>(true);
