import { dev } from '$app/environment';
import { TokenVault } from '$lib/server/backend/TokenVault';
import { authjs, guard, houdini } from '$lib/server/middleware';
import { Logger } from '$lib/utils';
// import envPri from '$lib/variables/variables.server';
import type { HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
/**
 * Code in hooks.server.ts will run when the application starts up,
 * making them useful for initializing database clients, Sentry and so on.
 */

// TODO: https://github.com/sveltejs/kit/issues/6731

// Setup logger
if (!dev) {
	Logger.enableProductionMode();
}

// for graceful termination
process.on('SIGINT', function () {
	process.exit();
}); // Ctrl+C
process.on('SIGTERM', function () {
	process.exit();
}); // docker stop

// Read: https://github.com/sveltejs/kit/blob/master/documentation/docs/07-hooks.md

// Initialize the Sentry SDK here
if (!dev) {
	// TODO
}

// Initialize TokenVault
TokenVault.init([
	// {
	// 	endpoint: envPri.MICROSOFT_GRAPH_ENDPOINT,
	// 	authConfig: {
	// 		auth_endpoint: `https://login.microsoftonline.com/${envPri.MICROSOFT_GRAPH_TENANT_ID}/oauth2/v2.0/token`,
	// 		client_id: envPri.MICROSOFT_GRAPH_CLIENT_ID,
	// 		client_secret: envPri.MICROSOFT_GRAPH_CLIENT_SECRET,
	// 		grant_type: 'client_credentials',
	// 		scope: envPri.MICROSOFT_GRAPH_SCOPES
	// 	}
	// }
]);

// Invoked for each endpoint called and initially for SSR router
// export const handle = sequence(setUser, guard, houdini, logger);
export const handle = sequence(authjs, guard, houdini);

export const handleServerError = (({ error, event }) => {
	console.error('hooks:server:handleServerError:', error);
	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		context: err.context
	};
}) satisfies HandleServerError;

export const handleFetch = (async ({ event, request, fetch }) => {
	console.debug('hooks.server.ts, HandleFetch: pageUrl:', event.url.toString());

	const token = TokenVault.getToken(request.url);
	if (token) {
		console.debug('hooks.server.ts, HandleFetch: adding token for:', request.url);
		request.headers.set('Authorization', `Bearer ${token}`);
	}
	/*
	if (request.url.startsWith('https://graph.microsoft.com')) {
		request.headers.set('Authorization', `Bearer ${microsoft_token}`);
	}
	if (request.url.startsWith('https://api.yourapp.com/')) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}
	*/
	return fetch(request);
}) satisfies HandleFetch;
