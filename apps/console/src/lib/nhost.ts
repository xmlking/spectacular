import { NhostClient } from '@nhost/nhost-js';
import type { NhostSession } from '@nhost/nhost-js';
import type { Cookies } from '@sveltejs/kit';
import { waitFor } from 'xstate/lib/waitFor';
import { env } from '$env/dynamic/public';
// import { env as secrets } from '$env/dynamic/private';

export const NHOST_SESSION_KEY = 'nhostSession';

export async function getNhost(cookies: Cookies) {
	const nhost = new NhostClient({
		subdomain: env.PUBLIC_NHOST_SUBDOMAIN || 'local',
		region: env.PUBLIC_NHOST_REGION,
		clientStorageType: 'cookie',
		// HINT: When set, it is sent as an `x-hasura-admin-secret` header for all GraphQL, Storage, and Serverless Functions requests.
		// adminSecret: secrets.HASURA_GRAPHQL_ADMIN_SECRET,
		start: false
	});

	const sessionCookieValue = cookies.get(NHOST_SESSION_KEY) || '';

	const initialSession: NhostSession = JSON.parse(atob(sessionCookieValue) || 'null');

	nhost.auth.client.start({ initialSession });

	if (nhost.auth.client.interpreter) {
		await waitFor(nhost.auth.client.interpreter, (state) => !state.hasTag('loading'));
	}

	return nhost;
}
