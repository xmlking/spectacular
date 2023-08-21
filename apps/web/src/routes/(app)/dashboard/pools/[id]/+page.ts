import { CachePolicy, GetPoolStore } from '$houdini';
import { poolUpdateSchema as schema } from '$lib/models/schema';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { superValidate } from 'sveltekit-superforms/client';

const getPoolStore = new GetPoolStore();
export const load = async (event) => {
	const {
		params: { id }
	} = event;
	const variables = { id };
	const { errors, data } = await getPoolStore.fetch({
		event,
		blocking: true,
		policy: CachePolicy.NetworkOnly,
		variables
	});
	if (errors) throw error(400, errors[0] as GraphQLError);
	const { pools_by_pk, devices_not_in_pool } = data ?? {};
	if (!pools_by_pk) throw error(404, 'Pool not found');
	const { displayName, description, tags, annotations, pool_devices } = pools_by_pk;

	const form = await superValidate({ displayName, description, tags, annotations }, schema);

	const inPool = pool_devices?.map(
		({ associationId, device: { id, displayName, ip, description, version, organization, tags, annotations, updatedAt } }) => ({
			id,
			associationId,
			displayName,
			ip,
			version,
			description,
			organization,
			tags,
			annotations,
			updatedAt
		})
	);

	// Always return { form } in load and form actions.
	return { poolId: id, inPool, notInPool: devices_not_in_pool, form };
};
