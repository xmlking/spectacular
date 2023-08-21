import { Logger } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';

export const log = new Logger('middleware:request');

export const logger = (async ({ event, resolve }) => {
	const timestamp = Date.now();
	const response = await resolve(event);
	const elapsed = Date.now() - timestamp;
	log.info({ elapsed, request: event.request, response }, `${event.request.method} ${event.request.url} ${response.status} ${elapsed}ms`);
	return response;
}) satisfies Handle;
