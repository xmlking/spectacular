import { order_by } from '$houdini';
import { policySearchSchema } from '$lib/schema/policy';
import { Logger, sleep } from '@spectacular/utils';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, SearchPoliciesVariables as Variables } from './$houdini';

const log = new Logger('policies:search-ts:browser');
/**
 * Note: `_houdini_beforeLoad` run first, then `_SearchPoliciesVariables` then load GQL
 */

/**
 * Validate input and return `form` object which is send along with `data` to +page.svelte
 */
export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  log.debug('in _houdini_beforeLoad');
  const form = await superValidate(url, zod(policySearchSchema));
  if (!form.valid) return { status: 400, form };
  // if (!form.valid) return fail(400, { form });
  // if (!form.valid) throw error(400, 'invalid input');
  return { form };
}

/**
 * Set query Variables for +page.gql
 */
export const _SearchPoliciesVariables: Variables = async (event) => {
  const { url } = event;
  log.debug('in _SearchPoliciesVariables', { url });
  const {
    data: { limit, offset, subjectType, subjectId },
  } = await superValidate(url, zod(policySearchSchema));
  // const dataCopy = cleanClone(form.data, { empty: 'strip' });
  const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
  const where = {
    ...(subjectType ? { subjectType: { _eq: subjectType } } : {}),
    ...(subjectId ? { subjectId: { _eq: subjectId } } : {}),
  };

  return {
    limit,
    offset,
    orderBy,
    where,
  };
};
