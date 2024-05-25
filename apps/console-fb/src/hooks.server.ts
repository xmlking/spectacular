import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { Logger } from '@spectacular/utils';
import { dev } from '$app/environment';
import { TokenVault } from '$lib/server/backend/TokenVault';
import { authjs, guard, houdini } from '$lib/server/middleware';
// import envPri from '$lib/variables/variables.server';
/**
 * Code in hooks.server.ts will run when the application starts up,
 * making them useful for initializing database clients, Sentry and so on.
 */

// TODO: https://github.com/sveltejs/kit/issues/6731

// Setup logger
if (!dev) {
	Logger.enableProductionMode();
}

const log = new Logger('hooks:server');

// for graceful termination
function shutdownGracefully() {
	// anything you need to clean up manually goes in here
	log.info('Shutdown Gracefully ...');
	process.exit();
}
process.on('SIGINT', shutdownGracefully); // Ctrl+C
process.on('SIGTERM', shutdownGracefully); // docker stop

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
export const handle: Handle = sequence(authjs, guard, houdini);

export const handleError: HandleServerError = async ({ error }) => {
	log.error('handleServerError:', error);
	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		context: err.context
	};
};

/**
 * This function allows you to modify (or replace) a fetch request
 * that happens inside a `load` or `action` function that runs on the server (or during pre-rendering).
 */
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	log.info(`HandleFetch: pageUrl: ${event.url.toString()} clientAddress: ${event.getClientAddress()}`);

	const token = TokenVault.getToken(request.url);
	if (token) {
		log.info(' HandleFetch: adding token for:', request.url);
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
};
