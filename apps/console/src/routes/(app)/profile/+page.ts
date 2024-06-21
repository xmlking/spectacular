import { CachePolicy, ListSecurityKeysStore, order_by } from '$houdini';
import { i18n } from '$lib/i18n.js';
import { changeEmailSchema, changePasswordSchema, webAuthnSchema } from '$lib/schema/user';
import { isAuthenticated } from '$lib/stores/user';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
const log = new Logger('user.profile.browser');

const searchPoliciesStore = new ListSecurityKeysStore();

export const load = async (event) => {
  const {
    url: { pathname },
  } = event;

  if (!isAuthenticated) {
    redirect(303, i18n.resolveRoute(`/signin?redirectTo=${pathname}`));
  }
  const cpForm = await superValidate(zod(changePasswordSchema));
  const ceForm = await superValidate(zod(changeEmailSchema));
  const waForm = await superValidate(zod(webAuthnSchema));
  const items = {}; // data?.policies;
  return { cpForm, ceForm, waForm, items };
};
