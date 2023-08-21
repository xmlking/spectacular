import type { GraphQLError } from 'graphql';
import type { ZodError } from 'zod';
import { ErrorBase } from './errors';

/**
 * Add any custom errors here:
 * Use `ErrorBase` to create custom errors for a specific usecase
 */

export class NotFoundError extends ErrorBase<'NOT_FOUND_ERROR'> {
	constructor(message: string, cause: Error = new Error('NotFound')) {
		super({ name: 'NOT_FOUND_ERROR', message, cause });
	}

	// return should be serializable to JSON
	toJSON(): App.Error {
		return {
			message: this.cause ? `${this.name}: ${this.message}; cause: ${this.cause}` : `${this.name}: ${this.message}`
		} as App.Error;
	}
}

// Convert ZodError to Friendly Error message to desplay to users
export class ValidationError extends ErrorBase<'VALIDATION_ERROR', ZodError> {
	constructor(
		// message: string,
		cause: ZodError,
		options: {
			maxIssuesInMessage?: number;
			issueSeparator?: string;
		} = {
			maxIssuesInMessage: 99, // I've got 99 problems but the b$tch ain't one
			issueSeparator: '; '
		}
	) {
		console.log(options);

		const reason = cause.errors
			// limit max number of issues printed in the reason section
			.slice(0, options.maxIssuesInMessage)
			// format error message
			.map((issue) => {
				const { message, path } = issue;

				if (path.length > 0) {
					return `${message} at "${joinPath(path)}"`;
				}

				return message;
			})
			// concat as string
			.join(options.issueSeparator);

		super({ name: 'VALIDATION_ERROR', message: reason ?? '', cause });
	}

	// return should be serializable to JSON
	toJSON(): App.Error {
		return { message: `${this.name}: ${this.message}` } as App.Error;
	}
}

function joinPath(arr: Array<string | number>): string {
	return arr.reduce<string>((acc, value) => {
		if (typeof value === 'number') {
			return acc + '[' + value + ']';
		}

		const separator = acc === '' ? '' : '.';
		return acc + separator + value;
	}, '');
}

type PolicyErrorName =
	| 'SEARCH_POLICY_ERROR'
	| 'GET_POLICY_ERROR'
	| 'CREATE_POLICY_ERROR'
	| 'UPDATE_POLICY_ERROR'
	| 'DELETE_POLICY_ERROR'
	| 'UPGRADE_POLICY_ERROR';
export class PolicyError extends ErrorBase<PolicyErrorName, GraphQLError> {
	constructor(name: PolicyErrorName, message: string, cause: GraphQLError) {
		super({ name, message, cause });
	}
	// return should be serializable to JSON
	toJSON(): App.Error {
		return { message: `${this.name}: ${this.message}; cause: ${this.cause.message}` } as App.Error;
	}
}

type DeviceErrorName =
	| 'SEARCH_DEVICE_ERROR'
	| 'GET_DEVICE_ERROR'
	| 'CREATE_DEVICE_ERROR'
	| 'UPDATE_DEVICE_ERROR'
	| 'DELETE_DEVICE_ERROR'
	| 'UPGRADE_DEVICE_ERROR';
export class DeviceError extends ErrorBase<DeviceErrorName, GraphQLError> {
	constructor(name: DeviceErrorName, message: string, cause: GraphQLError) {
		super({ name, message, cause });
	}
	// return should be serializable to JSON
	toJSON(): App.Error {
		return { message: `${this.name}: ${this.message}; cause: ${this.cause.message}` } as App.Error;
	}
}
