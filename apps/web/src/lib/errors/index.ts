/**
 * New Errors
 */
export { DeviceError, NotFoundError, PolicyError, ValidationError } from './custom';
export { ErrorBase } from './errors';
export { getHttpCode } from './grpc2http';
export { handleActionErrors, handleLoadErrors } from './handle';
export { ResponseError, isHttpError, type HttpError } from './http';

export type ErrorWithMessage = {
	message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === 'object' && error !== null && 'message' in error && typeof (error as Record<string, unknown>).message === 'string'
	);
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
	if (isErrorWithMessage(maybeError)) return maybeError;

	try {
		return new Error(JSON.stringify(maybeError));
	} catch {
		// fallback in case there's an error stringifying the maybeError
		// like with circular references for example.
		return new Error(String(maybeError));
	}
}

export function getErrorMessage(error: unknown) {
	return toErrorWithMessage(error).message;
}

export function isAppError(obj: any): obj is App.Error {
	return Object.prototype.hasOwnProperty.call(obj, 'message');
}

export function getAppError(error: unknown): App.Error {
	return { message: getErrorMessage(error) };
}

interface Redirect {
	status: number;
	location: string;
}

export function isRedirect(obj: unknown): obj is Redirect {
	return typeof obj === 'object' && obj !== null && 'status' in obj && 'location' in obj;
}
