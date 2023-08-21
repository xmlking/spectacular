export interface HttpError {
	status: number;
	body: { message: string } extends App.Error ? App.Error | string | undefined : App.Error;
}

export class ResponseError extends Error {
	response: Response;
	constructor(message: string, response: Response, options?: ErrorOptions) {
		super(message, options);
		this.response = response;
	}
}

export function isHttpError(obj: unknown): obj is HttpError {
	return typeof obj === 'object' && obj !== null && 'status' in obj && 'body' in obj;
}
