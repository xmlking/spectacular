/**
 * Use this store client-side only with onMount
 */
import { derived } from 'svelte/store';
import { page } from '$app/stores';

export const user = derived(page, ($page) => {
  return $page.data.session?.user;
});

export const token = derived(page, ($page) => {
  return $page.data.session?.token;
});

export const roles = derived(page, ($page) => {
  return $page.data.session?.roles;
});
