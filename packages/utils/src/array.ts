/**
 * Groups an array of objects by a specified key.
 * @param arr - The array of objects to group.
 * @param key - The key to group the objects by.
 * @returns An object with keys as the unique values of the specified key and values as arrays of objects with that key value.
 */
export const groupBy = <T extends Record<string, any>, K extends keyof T>(
	arr: T[],
	key: K
): Record<string, T[]> =>
	arr.reduce(
		(acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc),
		{} as Record<string, T[]>
	);
