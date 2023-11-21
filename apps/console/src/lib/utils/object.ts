export function getObjectTypeName(value: unknown): string {
	return toString.call(value).slice(8, -1);
}

/**
 * empty: empty fields striped or set to `null`
 * target: target fields striped or set to `null` (WIP)
 */
type CleanOpts = { empty?: 'strip' | 'null'; target?: string[] };
export function cleanClone<T extends Object>(obj: T, opts: CleanOpts): T {
	// TODO: check 'structuredClone' available in globalThis
	const cloneObj = structuredClone(obj);
	if (opts.empty == 'strip') {
		stripEmptyProperties(cloneObj);
	} else if (opts.empty == 'null') {
		nullifyEmptyProperties(cloneObj);
	} else {
		throw Error('Unsupported CleanOpts');
	}
	return cloneObj;
}

function stripEmptyProperties(obj) {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (obj[key] === null || obj[key] === undefined || (typeof obj[key] === 'string' && obj[key].trim() === '')) {
				delete obj[key];
			} else if (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
				stripEmptyProperties(obj[key]); // Recursively check nested objects
				if (Object.keys(obj[key]).length === 0) {
					delete obj[key];
				}
			}
		}
	}
}
function nullifyEmptyProperties(obj) {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (obj[key] === null || obj[key] === undefined || (typeof obj[key] === 'string' && obj[key].trim() === '')) {
				obj[key] = null;
			} else if (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
				nullifyEmptyProperties(obj[key]); // Recursively check nested objects
				if (Object.keys(obj[key]).length === 0) {
					delete obj[key];
				}
			}
		}
	}
}

// RUN: ./node_modules/.bin/vitest src/lib/utils/object.ts
// in-source testing
if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;

	it('Test cleanClone with strip option', async () => {
		const jsonObject = {
			name: 'John',
			age: null,
			dob: new Date('2023-06-05T07:07:00.000Z'),
			address: {
				street: '123 Main St',
				city: '',
				country: undefined,
				postalCode: null
			},
			occupation: undefined
		};
		const cloneObj = cleanClone(jsonObject, { empty: 'strip' });
		expect(cloneObj).toStrictEqual({ name: 'John', dob: new Date('2023-06-05T07:07:00.000Z'), address: { street: '123 Main St' } });
	});
}
