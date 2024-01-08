import { derived } from 'svelte/store';
import { page } from '$app/stores';

/**
 * Narrowing reactivity scope.
 */
export const lang = derived(page, ($page) => $page.data.lang);
