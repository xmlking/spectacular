import { Logger } from '@repo/utils';
import type { ClientInit, HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { NHOST_SESSION_KEY } from '$lib/constants';

/**
 * Code in `init` method in `hooks.client.ts` will run one-time in browser, when the application starts up,
 * making them useful for initializing database clients, logger, Sentry and so on.
 */
export const init: ClientInit = async () => {
  console.log('in hooks.client.ts init:');
  // Setup logger
  if (!dev) {
    Logger.enableProductionMode();
  }

  // for debug cookies in development mode.
  if (dev && 'cookieStore' in window) {
    // @ts-ignore
    cookieStore.onchange = (event: CookieChangeEvent) => {
      // console.log("cookie changed", {event});
      if (event.deleted[0] && event.deleted[0].name === NHOST_SESSION_KEY) {
        console.log('cookie deleted', { deleted: event.deleted[0].value });
      }
      if (event.changed[0] && event.changed[0].name === NHOST_SESSION_KEY) {
        console.log('cookie changed', { changed: event.changed[0].value });
      }
    };
  }
};

const log = new Logger('hooks:client');

/**
 * handle client-side errors
 * TODO: Error monitoring via Sentry
 */
export const handleError: HandleClientError = async ({ error, status, message, event }) => {
  log.error('handleClientError:', error, status, message, event);
  // example integration with https://sentry.io/
  // Sentry.captureException(error, {
  // 	extra: { event, errorId, status },
  // });

  const err = error as App.Error;
  return {
    ...err,
    message: message ?? err.message ?? 'Whoops!',
  };
};
