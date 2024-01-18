import type { Handle } from '@sveltejs/kit';
import { Logger, startsWith } from '@spectacular/utils';
import { dev } from '$app/environment';
import { limiter } from '$lib/server/limiter/limiter';

/**
 * Rate Limit some routes
 * This should be the first middleware.
 */
const log = new Logger('server:middleware:limiter');
const rateLimitedPaths = ['/auth/sign-up', '/auth/forgot-password', '/auth/change-password', '/downlaod'];

export const rateLimiter = (async ({ event, resolve }) => {
	const {
		url: { pathname }
	} = event;

	// bypass limiter for all protected routes.
	if (dev || !startsWith(pathname, rateLimitedPaths)) {
		return await resolve(event);
	}

	await limiter.cookieLimiter?.preflight(event);

	const status = await limiter.check(event);
	log.debug({ status });

	console.log(status);
	if (status.limited) {
		event.setHeaders({
			'Retry-After': status.retryAfter.toString()
		});
		return new Response('Too many requests', {
			status: 429,
			headers: {
				'Retry-After': status.retryAfter.toString()
			},
			statusText: 'You have made too many requests, please try again later.'
		});
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
