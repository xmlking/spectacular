import { dev } from '$app/environment';
import { limiter } from '$lib/server/limiter/limiter';
import { Logger, startsWith } from '@spectacular/utils';
import type { Handle } from '@sveltejs/kit';

/**
 * Rate Limit some routes
 * This should be the first middleware.
 */
const log = new Logger('server:middleware:limiter');
const rateLimitedPaths = ['/signin', '/signup', '/reset', '/downlaod'];

export const rateLimiter = (async ({ event, resolve }) => {
  const {
    url: { pathname },
  } = event;

  if (dev || !startsWith(pathname, rateLimitedPaths)) {
    // bypass limiter for all protected routes.
    return await resolve(event);
  }

  await limiter.cookieLimiter?.preflight(event);

  const status = await limiter.check(event);
  log.debug({ status });

  if (status.limited) {
    event.setHeaders({
      'Retry-After': status.retryAfter.toString(),
    });
    return new Response('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': status.retryAfter.toString(),
      },
      statusText: 'You have made too many requests, please try again later.',
    });
  }

  const response = await resolve(event);
  return response;
}) satisfies Handle;
