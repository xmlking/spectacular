export function startsWith(str: string, substrs: string[]) {
  return substrs.some((substr) => str.startsWith(substr));
}

export function camelize(str: string) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}
