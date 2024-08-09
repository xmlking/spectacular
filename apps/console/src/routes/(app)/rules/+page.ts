import { order_by } from '$houdini';
import { ruleSearchSchema } from '$lib/schema/rule';
import { Logger } from '@spectacular/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, SearchRulesVariables as Variables } from './$houdini';

const log = new Logger('rules:search-ts:browser');

export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  log.debug('in _houdini_beforeLoad');
  const form = await superValidate(url, zod(ruleSearchSchema));
  if (!form.valid) return { status: 400, form };
  return { form };
}

export const _SearchRulesVariables: Variables = async (event) => {
  const { url } = event;
  log.debug('in _SearchRulesVariables', { url });
  const {
    data: { limit, offset, displayName },
  } = await superValidate(url, zod(ruleSearchSchema));
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
