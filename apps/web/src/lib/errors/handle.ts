// TODO: Global error handlers

import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { getAppError, isAppError, isHttpError, isRedirect, ResponseError, ValidationError } from '.';
import { NotFoundError } from './custom';

export function handleLoadErrors(err: unknown) {
	// console.error(error.stack);
	if (err instanceof NotFoundError && err.name === 'NOT_FOUND_ERROR') {
		throw error(404, { message: err.message, context: err.toJSON() });
	} else if (err instanceof ResponseError) {
		switch (err.response.status) {
			case 401:
			case 403: {
				throw error(err.response.status, err.response.statusText);
			}
			case 400:
			case 404:
			case 405: {
				throw error(err.response.status, err.response.statusText);
			}
			default: {
				throw error(err.response.status, err.response.statusText);
			}
		}
	} else if (isHttpError(err)) {
		throw error(err.status, err.body);
	} else if (isAppError(err)) {
		throw error(500, err);
	} else {
		throw error(500, getAppError(err));
	}
}

/**
 * Handle ActionErrors
 * The `data` argument of fail() should be serializable to JSON.
 */
export function handleActionErrors(err: unknown) {
	if (err instanceof NotFoundError && err.name === 'NOT_FOUND_ERROR') {
		return fail(404, { actionError: err.toJSON() });
	} else if (err instanceof ZodError) {
		return fail(400, { actionError: new ValidationError(err).toJSON() });
	} else if (isAppError(err)) {
		return fail(400, { actionError: err });
	} else if (isRedirect(err)) {
		if (err.status < 310) throw err;
	} else if (isHttpError(err)) {
		throw error(err.status, err.body);
	} else {
		throw error(500, getAppError(err));
	}
}
