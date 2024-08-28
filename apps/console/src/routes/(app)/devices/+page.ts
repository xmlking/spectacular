import { order_by } from '$houdini';
import { deviceSearchSchema } from '$lib/schema/device';
import { Logger } from '@spectacular/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BeforeLoadEvent, SearchDevicesPage, SearchDevicesPageVariables as Variables } from './$houdini';

const log = new Logger('devices:search-ts:browser');

export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
  log.debug('in _houdini_beforeLoad');
  const form = await superValidate(url, zod(deviceSearchSchema));
  if (!form.valid) return { status: 400, form };
  return { form };
}

export const _SearchDevicesPageVariables: Variables = async (event) => {
  const { url } = event;
  log.debug('in _SearchDevicesVariables', { url });
  const {
    data: { limit, offset, displayName },
  } = await superValidate(url, zod(deviceSearchSchema));
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
