export function startsWith(str: string, substrs: string[]) {
  return substrs.some((substr) => str.startsWith(substr));
}

export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, '');
}
