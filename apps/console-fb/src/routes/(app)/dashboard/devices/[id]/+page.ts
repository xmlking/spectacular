import { CachePolicy, GetDeviceStore } from '$houdini';
import { updateDeviceSchema as schema } from '$lib/models/schema';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const getDeviceStore = new GetDeviceStore();
export const load = async (event) => {
  const {
    params: { id },
  } = event;
  const variables = { id }; // TODO: validate `id`
  const { errors, data } = await getDeviceStore.fetch({
    event,
    blocking: true,
    policy: CachePolicy.NetworkOnly,
    variables,
  });
  if (errors) error(400, errors[0] as GraphQLError);
  const device = data?.devices_by_pk;
  if (!device) error(404, 'Device not found');
  const form = await superValidate(device, zod(schema));
  return { form };
};
