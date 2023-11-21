export function startsWith(str: string, substrs: string[]) {
	return substrs.some((substr) => str.startsWith(substr));
}
