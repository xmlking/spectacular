import { createClient as createWSClient } from 'graphql-ws';
import { Logger } from '@spectacular/utils';
import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import { subscription } from '$houdini/plugins';
import { HoudiniClient } from '$houdini';
import type { ClientPlugin } from '$houdini';

const url = env.PUBLIC_GRAPHQL_ENDPOINT;

const log = new Logger('houdini.client');

// in order to verify that we send metadata, we need something that will log the metadata after
const logMetadata: ClientPlugin = () => ({
	end(ctx, { resolve, value }) {
		if (ctx.metadata?.logResult === true) {
			log.info(JSON.stringify(value));
		}

		resolve(ctx);
	}
});
const subClient: ClientPlugin = subscription(({ session }) =>
	createWSClient({
		url: url.replace('https://', 'wss://').replace('http://', 'ws://'),
		connectionParams: () => {
			return {
				headers: {
					Authorization: `Bearer ${session?.token}`
				}
			};
		}
	})
);

// Export the Houdini client
export default new HoudiniClient({
	url,
	fetchParams({ session, metadata }) {
		if (metadata) {
			log.debug('metadata...', metadata);
		}
		if (session) {
			log.debug('session...', session);
		}
		const token = session?.token;
		const roles = session?.roles;
		const backendToken = metadata?.backendToken;
		const useRole = metadata?.useRole ?? getHighestRole(roles);

		return {
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				...(useRole ? { 'x-hasura-role': useRole } : { 'x-hasura-role': 'anonymous' }),
				...(backendToken ? { backendToken } : {})
			}
		};
	},
	// throwOnError: {
	// 	operations: ['all'],
	// 	error: (errors) => error(500, errors.map((error) => error.message).join('. ') + '.')
	// },
	plugins: [subClient, ...(browser ? [logMetadata] : [])]
});

function getHighestRole(roles: string[] | undefined) {
	if (!roles) return 'anonymous';
	if (roles?.includes('tester')) return 'tester';
	if (roles?.includes('manager')) return 'manager';
	if (roles?.includes('user')) return 'user';
	log.error(`unsupported role in user roles: ${roles}`);
	throw Error(`unsupported role in user roles: ${roles}`);
}
