// import { error } from '@sveltejs/kit';
import { createClient as createWSClient } from 'graphql-ws';
import { Logger } from '@spectacular/utils';
import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import { subscription } from '$houdini/plugins';
import { HoudiniClient } from '$houdini';
import type { ClientPlugin } from '$houdini';

const url = env.PUBLIC_GRAPHQL_ENDPOINT!;

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
					Authorization: `Bearer ${session?.accessToken}`
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
		const accessToken = session?.accessToken;
		const backendToken = metadata?.backendToken;
		const useRole = metadata?.useRole

		return {
			headers: {
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				...(useRole ? { 'x-hasura-role': useRole } : {}),
				...(backendToken ? { backendToken } : {})
			}
		};
	},
	// throwOnError: {
	// 	// can be any combination of
	// 	// query, mutation, subscription, and all
	// 	operations: ['all'],
	// 	// the function to call
	// 	error: (errors, ctx) => error(500, `(${ctx.artifact.name}): ` + errors.map((err) => err.message).join('. ') + '.')
	// },
	plugins: [subClient, ...(browser ? [logMetadata] : [])]
});
