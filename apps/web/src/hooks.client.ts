import { dev } from '$app/environment';
import { Logger } from '$lib/utils';
import type { HandleClientError } from '@sveltejs/kit';

// Setup logger
if (!dev) {
	Logger.enableProductionMode();
}

// Initialize the Sentry SDK here
if (!dev) {
	// TODO
}

export const handleClientError = (({ error, event }) => {
	console.error('hooks:client:handleClientError:', error);
	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		context: err.context
	};
}) satisfies HandleClientError;
