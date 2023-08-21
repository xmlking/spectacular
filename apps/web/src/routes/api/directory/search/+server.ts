import { CachePolicy, SearchDevicesStore, SearchPoolsStore, order_by, subject_type_enum } from '$houdini';
import { DeviceError, NotFoundError } from '$lib/errors';
import { listGroups, listUsers, type Subject } from '$lib/server/backend/msgraph';
import { Logger } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';

const log = new Logger('api:directory:search');
const searchDevicesStore = new SearchDevicesStore();
const searchPoolsStore = new SearchPoolsStore();

const limit = 10;
const orderBy = [{ updatedAt: order_by.desc_nulls_last }];

// GET /api/directory/search?subType=user&search=sumo
export const GET = async (event) => {
	const { url, fetch } = event;
	const urlParams = new URLSearchParams(url.searchParams);
	let subType = urlParams.get('subType') ?? subject_type_enum.user;
	if (!subType) {
		subType = subject_type_enum.user;
	}
	const filter = urlParams.get('filter');
	const search = urlParams.get('search') ?? '';
	// log.debug(subType, filter, search);
	const where = {
		displayName: { _like: `%${search}%` }
	};
	const variables = { where, limit, orderBy };
	// log.debug({ where });
	let results: Subject[] = [];
	if (filter == undefined && search == undefined) return json({ results });

	try {
		switch (subType) {
			case subject_type_enum.user:
			case subject_type_enum.service_account:
				results = await listUsers(fetch, search);
				break;
			case subject_type_enum.group:
				results = await listGroups(fetch, search);
				break;
			case subject_type_enum.device: {
				// fetching device data from GraphQL
				const { errors: deviceErrors, data: deviceData } = await searchDevicesStore.fetch({
					event,
					blocking: true,
					policy: CachePolicy.CacheAndNetwork,
					variables
				});
				if (deviceErrors) throw new DeviceError('SEARCH_DEVICE_ERROR', 'list devices api error', deviceErrors[0] as GraphQLError);
				if (!deviceData) throw new NotFoundError('devices data is null');
				results = deviceData.devices.map((obj) => {
					return {
						id: obj.id,
						displayName: obj.displayName,
						secondaryId: obj.displayName
					};
				});
				break;
			}
			case subject_type_enum.device_pool: {
				const { errors: poolErrors, data: poolData } = await searchPoolsStore.fetch({
					event,
					blocking: true,
					policy: CachePolicy.CacheAndNetwork,
					metadata: { logResult: true },
					variables
				});
				if (poolErrors) throw new DeviceError('SEARCH_DEVICE_ERROR', 'list devices api error', poolErrors[0] as GraphQLError);
				if (!poolData) throw new NotFoundError('devices data is null');
				results = poolData.pools.map((obj) => {
					return {
						id: obj.id,
						displayName: obj.displayName,
						secondaryId: obj.displayName
					};
				});
				break;
			}
			default:
				throw new Error(`Unknown Subject Type: ${subType}`, { cause: Error(`${subType}`) });
		}
		log.debug('results....', results);
		return json({ results });
	} catch (error) {
		log.error(error);
		return json(
			{ error },
			{
				status: 404
			}
		);
	}
};
