import type { HandleClientError } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { dev } from '$app/environment';

// Setup logger
if (!dev) {
    Logger.enableProductionMode();
}

const log = new Logger('hooks:client');
// Initialize the Sentry SDK here
if (!dev) {
    // TODO
}

/**
 * handle client-side errors
 * TODO: Error monitoring via Sentry
 */
export const handleError: HandleClientError = ({ error }) => {
    log.error('handleClientError:', error);
    const err = error as App.Error;
    return {
        message: err.message ?? 'Whoops!',
        context: err.context,
    };
};
