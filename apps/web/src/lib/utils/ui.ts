/* eslint-disable @typescript-eslint/no-explicit-any */
export const classNames = (...classNames: string[]) => {
	return classNames.join(' ');
};
export const arrayToObject = (object: unknown[], arrayKeys: string[]) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = {};
	for (let i = 0; i < arrayKeys.length; i++) {
		result[arrayKeys[i]] = object[i];
	}
	return result;
};
export const debounce = (func: (...args: any) => void, timeout = 300) => {
	let timer: ReturnType<typeof setTimeout> | undefined = undefined;
	return (...args: any) => {
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
