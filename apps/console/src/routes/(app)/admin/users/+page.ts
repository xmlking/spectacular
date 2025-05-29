import { order_by } from '$houdini';
import { searchUserSchema as schema } from '$lib/schema/user';
import { Logger } from '@repo/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, SearchUsersAllVariables as Variables } from './$houdini';

const log = new Logger('users:search:browser');
/**
 * Note: `_houdini_beforeLoad` run first, then `_SearchUsersAllVariables` then load GQL
 */

/**
 * Validate input and return `form` object which is send along with `data` to +page.svelte
 */
export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  log.debug('in _houdini_beforeLoad');
  const form = await superValidate(url, zod(schema));
  if (!form.valid) return { status: 400, form };
  // if (!form.valid) return fail(400, { form });
  // if (!form.valid) throw error(400, 'invalid input');
  return { form };
}

/**
 * Set query Variables for +page.gql
 */
export const _SearchUsersAllVariables: Variables = async (event) => {
  const { url } = event;
  log.debug('in _SearchUsersAllVariables', { url });
  const {
    data: { limit, offset, displayName },
  } = await superValidate(url, zod(schema));
  // const dataCopy = cleanClone(form.data, { empty: 'strip' });
  const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
  const where = {
    ...(displayName ? { displayName: { _ilike: `%${displayName}%` } } : {}),
  };

  return {
    limit,
    offset,
    orderBy,
    where,
  };
};
