import { dev } from '$app/environment';
import { Logger } from '@spectacular/utils';
import type { HandleClientError, ClientInit } from '@sveltejs/kit';

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
