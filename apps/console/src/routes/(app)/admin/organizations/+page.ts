import { order_by } from '$houdini';
import { searchOrganizationSchema as schema } from '$lib/schema/organization';
import { Logger } from '@repo/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, SearchOrganizationsVariables as Variables } from './$houdini';

const log = new Logger('organizations:search:browser');
/**
 * Note: `_houdini_beforeLoad` run first, then `_SearchOrganizationsVariables` then load GQL
 */

/**
 * Validate input and return `form` object which is send along with `data` to +page.svelte
 */
export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  log.debug('in _houdini_beforeLoad');
  const form = await superValidate(url, zod4(schema));
  if (!form.valid) return { status: 400, form };
  // if (!form.valid) return fail(400, { form });
  // if (!form.valid) throw error(400, 'invalid input');
  return { form };
}

/**
 * Set query Variables for +page.gql
 */
export const _SearchOrganizationsVariables: Variables = async (event) => {
  const { url } = event;
  log.debug('in _SearchOrganizationsVariables', { url });
  const {
    data: { limit, offset, displayName },
  } = await superValidate(url, zod4(schema));
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
