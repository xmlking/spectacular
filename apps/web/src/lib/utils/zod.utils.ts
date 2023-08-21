import { z } from 'zod';

/**
 * Utility functions
 */
export function emptyToNull(arg: unknown) {
	if (typeof arg !== 'string') {
		return arg;
	}
	if (arg.trim() === '') {
		return null;
	}
	return arg;
}

export function ifNonEmptyString(fn: (value: string) => unknown): (value: unknown) => unknown {
	return (value: unknown) => {
		if (typeof value !== 'string') {
			return value;
		}

		if (value.trim() === '') {
			// return undefined;
			return null;
		}

		return fn(value);
	};
}

/**
 * schemas
 */
export const uuidSchema = z.string().uuid();
export const dbOffsetDate = z.preprocess((arg) => (arg === '' ? null : arg), z.string().datetime({ offset: true }).nullish());

/**
 * Converters / type coercion
 */
export const stringToBoolean = ifNonEmptyString((arg) => arg.toLowerCase() === 'true');

export const stringToNumber = (arg: unknown) => (typeof arg == 'string' && /^\d+$/.test(arg) ? parseInt(arg, 10) : undefined);
export const stringToNumber2 = (arg: unknown) => {
	const processed = z.string().trim().regex(/^\d+$/).transform(Number).safeParse(arg);
	return processed.success ? processed.data : arg;
};

// export const stringToDate = (arg: unknown) => ((typeof arg == 'string' && arg.length > 0) || arg instanceof Date ? new Date(arg) : undefined);
export const stringToDate = ifNonEmptyString((arg) => new Date(arg));

// export const stringToSet = (arg: unknown) => (typeof arg == 'string' ? new Set(arg.split(',')) : undefined);
export const stringToSet = ifNonEmptyString((arg) => new Set(arg.split(',')));
export const stringToArray = ifNonEmptyString((arg) => arg.split(','));
export const arrayToString = (arg: string[]) => `{${arg.join(',')}}`;
export const stringToMap = ifNonEmptyString((arg) => new Map(Object.entries(JSON.parse(arg))));
export const mapToString = (arg: Map<string, string>) => Array.from(arg, ([k, v]) => `"${k}"=>"${v}"`).join(',');
export const stringToJSON = ifNonEmptyString((arg) => JSON.parse(arg));

/**
 * https://twitter.com/jjenzz/status/1612531220780294174?s=20&t=VYqGsLYl_9H-CSenMZ-hCg
 * Usage:  email: asOptionalField(z.string().email())
 */
export const emptyStringToUndefined = z.literal('').transform(() => undefined);
export const emptyStringToNull = z.literal('').transform(() => null);
export function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
	return schema.optional().or(emptyStringToUndefined);
}

// in-source testing
if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;

	it('Test arrayToString', async () => {
		const dataArray = ['sumo', 'demo'];
		const result = arrayToString(dataArray);
		expect(result).toBe('{sumo,demo}');
	});

	it('Test mapToString', async () => {
		const dataMap = new Map<string, string>([
			['key1', 'value1'],
			['key2', 'value2']
		]);
		const result = mapToString(dataMap);
		expect(result).toBe('"key1"=>"value1","key2"=>"value2"');
	});
}
