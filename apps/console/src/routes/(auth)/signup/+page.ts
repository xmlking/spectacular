import { i18n } from '$lib/i18n';
import { signUpSchema } from '$lib/schema/user';
import { isAuthenticated } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function _houdini_beforeLoad() {
  if (get(isAuthenticated)) redirect(302, i18n.resolveRoute('/dashboard'));
  const form = await superValidate(zod(signUpSchema));
  return { form };
}
