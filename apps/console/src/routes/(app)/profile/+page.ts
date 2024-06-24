import { i18n } from '$lib/i18n.js';
import { changeEmailSchema, changePasswordSchema, webAuthnSchema } from '$lib/schema/user';
import { isAuthenticated, user } from '$lib/stores/user';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, GetUserVariables as Variables } from './$houdini';

const log = new Logger('user.profile.browser');

export const _GetUserVariables: Variables = async (event) => {
  const userId = get(user)?.id;
  if (!userId) {
    log.error('not authenticated');
    throw error(400, 'not authenticated');
  }
  return { userId };
};

export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  if (!get(isAuthenticated)) redirect(302, i18n.resolveRoute('/signin?redirectTo=/profile'));
  const cpForm = await superValidate(zod(changePasswordSchema));
  const ceForm = await superValidate(zod(changeEmailSchema));
  const waForm = await superValidate(zod(webAuthnSchema));
  return { cpForm, ceForm, waForm };
}

// export async function _houdini_afterLoad({ event, input, data }: AfterLoadEvent) {
// }
