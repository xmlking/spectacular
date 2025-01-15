import { order_by } from '$houdini';
import { searchRuleSchema } from '$lib/schema/rule';
import { Logger } from '@spectacular/utils';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, SearchRulesVariables as Variables } from './$houdini';

const log = new Logger('rules:search:browser');
/**
 * Note: `_houdini_beforeLoad` run first, then `_SearchRulesVariables` then load GQL
 */

/**
 * Validate input and return `form` object which is send along with `data` to +page.svelte
 */
export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  log.debug('in _houdini_beforeLoad');
  const form = await superValidate(url, zod(searchRuleSchema));
  if (!form.valid) return { status: 400, form };
  // if (!form.valid) return fail(400, { form });
  // if (!form.valid) throw error(400, 'invalid input');
  return { form };
}

/**
 * Set query Variables for +page.gql
 */
export const _SearchRulesVariables: Variables = async (event) => {
  const { url } = event;
  log.debug('in _SearchRulesVariables', { url });
  const {
    data: { limit, offset, displayName, shared },
  } = await superValidate(url, zod(searchRuleSchema));
  // const dataCopy = cleanClone(form.data, { empty: 'strip' });
  const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
  const where = {
    ...(displayName ? { displayName: { _ilike: `%${displayName}%` } } : {}),
    ...(shared !== undefined ? { shared: { _eq: shared } } : {}),
  };

  return {
    limit,
    offset,
    orderBy,
    where,
  };
};
