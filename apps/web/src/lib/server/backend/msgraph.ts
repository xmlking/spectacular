import envPri from '$lib/variables/variables.server';

const defaultUserFilter = envPri.DIRECTORY_FILTER_USER_SUFFIX ? `endswith(userPrincipalName,'${envPri.DIRECTORY_FILTER_USER_SUFFIX}')` : '';
const defaultGroupFilter = envPri.DIRECTORY_FILTER_GROUP_PREFIX ? `startswith(displayName,'${envPri.DIRECTORY_FILTER_GROUP_PREFIX}')` : '';
const defaultDeviceFilter = envPri.DIRECTORY_FILTER_DEVICE_PREFIX
	? `startswith(displayName,'${envPri.DIRECTORY_FILTER_DEVICE_PREFIX}')`
	: '';

/**
 * Types
 */
export interface MSGraphResponse<T> {
	'@odata.context': string;
	'@odata.count': number;
	value: T[];
}

export interface User {
	id: string;
	displayName: string;
	userPrincipalName: string;
}
export interface Group {
	id: string;
	displayName: string;
	securityIdentifier: string;
}

type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 * Data Fetchers
 */
const fakeUsers = [
	{
		id: 'f26ea26d-400d-4fdd-aaa2-a0cc4e183667',
		displayName: 'Fake User 1',
		secondaryId: 'fake-user-1@user.com'
	},
	{
		id: '4efa08b7-3133-4f99-ad21-0ade7b3e14ed',
		displayName: 'Fake User 2',
		secondaryId: 'fake-user-2@user.com'
	},
	{
		id: '5c782443-6646-4562-97c5-3328b7506025',
		displayName: 'Fake User 3',
		secondaryId: 'fake-user-3@user.com'
	},
	{
		id: '746186f9-7a0f-4bb4-b3cc-e0a0d5bbab05',
		displayName: 'Fake User 4',
		secondaryId: 'fake-user-4@user.com'
	}
];
const fakeGroups = [
	{
		id: '1a287029-e970-44bb-aec5-c144eaac551d',
		displayName: 'Fake Group 1',
		secondaryId: 'fake-group-1@group.com'
	},
	{
		id: '2674a722-7e8b-4d8e-a7c3-4bf65c645ab9',
		displayName: 'Fake Group 2',
		secondaryId: 'fake-group-2@group.com'
	},
	{
		id: 'b4fbb586-fee3-4342-a7c2-13151a2b467f',
		displayName: 'Fake Group 3',
		secondaryId: 'fake-group-3@group.com'
	},
	{
		id: 'f493a151-7dc6-4e58-a700-89cfd9a772f1',
		displayName: 'Fake Group 4',
		secondaryId: 'fake-group-4@group.com'
	}
];
export async function listUsers(fetch: Fetch, search: string, filter?: string) {
	return fakeUsers;
}

export async function listGroups(fetch: Fetch, search: string, filter?: string) {
	return fakeGroups;
}

export async function listUsers1(fetch: Fetch, search: string, filter?: string) {
	var url = new URL(envPri.MICROSOFT_GRAPH_ENDPOINT + '/v1.0/users?$count=true&$top=10');
	url.searchParams.append('$select', 'id,displayName,userPrincipalName');
	url.searchParams.append('$filter', filter || defaultUserFilter);
	url.searchParams.append('$search', `"displayName:${search}"`);

	const res = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			ConsistencyLevel: 'eventual',
			'Content-Type': 'application/json'
		}
	});
	if (res.ok) {
		const data: MSGraphResponse<User> = await res.json();
		return data.value.map(({ id, displayName, userPrincipalName }) => ({ id, displayName, secondaryId: userPrincipalName }));
	} else {
		console.log(`Error ${res.status} calling MSGraphAPI in getUsers: ${res.statusText}`);
		throw `Error code: ${res.status} statusText: ${res.statusText}`;
	}
}

export async function listGroups1(fetch: Fetch, search: string, filter?: string) {
	var url = new URL(envPri.MICROSOFT_GRAPH_ENDPOINT + '/v1.0/groups?$count=true&$top=10');
	url.searchParams.append('$select', 'id,displayName,securityIdentifier');
	url.searchParams.append('$filter', filter || defaultUserFilter);
	url.searchParams.append('$search', `"displayName:${search}"`);

	const res = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			ConsistencyLevel: 'eventual',
			'Content-Type': 'application/json'
		}
	});
	if (res.ok) {
		const data: MSGraphResponse<Group> = await res.json();
		return data.value.map(({ id, displayName, securityIdentifier }) => ({ id, displayName, secondaryId: securityIdentifier }));
	} else {
		console.log(`Error ${res.status} calling MSGraphAPI in getUsers: ${res.statusText}`);
		throw `Error code: ${res.status} statusText: ${res.statusText}`;
	}
}
