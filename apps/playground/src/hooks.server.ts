import { dev } from '$app/environment';
import { i18n } from '$lib/i18n';
import { theme } from '$lib/server/middleware';
import { Logger } from '@spectacular/utils';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { ZodError } from 'zod';

/**
 * Code in hooks.server.ts will run when the application starts up,
 * making them useful for initializing database clients, logger, Sentry and so on.
 */

// Setup logger
if (!dev) {
  Logger.enableProductionMode();
}

const log = new Logger('hooks:server');

// NOTE: Order is impotent! `auth` middleware sets `nhost` into `local` which is used by `guard` middleware
export const handle: Handle = sequence(i18n.handle(), theme);

/**
 * handle server-side errors
 * TODO: Error monitoring via Sentry
 */
export const handleError: HandleServerError = async ({ error, status, message /*event*/ }) => {
  log.error('handleServerError:', status, message, error /*event*/);

  // example integration with https://sentry.io/
  // Sentry.captureException(error, {
  // 	extra: { event, errorId, status },
  // });

  if (error instanceof ZodError) {
    log.debug('ZodError...');
  }
  const err = error as App.Error;
  return {
    ...err,
    message: message ?? err.message ?? 'Whoops!',
  };
};

/**
 * This function allows you to modify (or replace) a fetch request
 * that happens inside a `load` or `action` function that runs on the server (or during pre-rendering).
 */
export const handleFetch = async ({ event, request, fetch }) => {
  console.debug('handleFetch:', event.url.toString());
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
