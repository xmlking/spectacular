/**
 * https://engineering.udacity.com/handling-errors-like-a-pro-in-typescript-d7a314ad4991
 * https://twitter.com/Steve8708/status/1611757223008665600?s=20&t=7gihcqFYQWJW5ADRpqrLXw
 */
// export class ErrorBase<T extends string> extends Error {
export abstract class ErrorBase<T extends string, C extends Error = Error> extends Error {
	name: T;
	message: string;
	// cause: unknown;
	cause: C;
	constructor(error: ErrorWithCause<T, C>) {
		super();
		this.name = error.name;
		this.message = error.message;
		this.cause = error.cause;
	}
	abstract toJSON(): App.Error;
}

interface ErrorWithCause<T, C> {
	name: T;
	message: string;
	// cause: unknown;
	cause: C;
}
