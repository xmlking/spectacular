export function iterable<T extends object>(obj: T) {
	return {
		...obj,
		*[Symbol.iterator]() {
			for (const key of Object.keys(obj)) {
				yield [key, obj[key]];
			}
		}
	};
}

// RUN: ./node_modules/.bin/vitest src/lib/utils/obj-iterable.ts
// in-source testing
if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('Test object iterable', async () => {
		const obj = iterable({ name: 'Builder.io' });
		// ..
		for (const [key, value] of obj) {
			console.log(key, value);
		}
	});
}
