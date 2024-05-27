import type { HandleClientError } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { dev } from '$app/environment';

// Setup logger
if (!dev) {
    Logger.enableProductionMode();
}

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
