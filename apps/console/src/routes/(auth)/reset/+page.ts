import { i18n } from '$lib/i18n';
import { resetPasswordSchema } from '$lib/schema/user';
import { isAuthenticated } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
  if (get(isAuthenticated)) redirect(302, i18n.resolveRoute('/dashboard'));
  const form = await superValidate(zod(resetPasswordSchema));
  return { form };
};
