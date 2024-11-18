export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatStringToDate(inputString: string, locale = 'en') {
  const date = new Date(inputString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const isURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the value is a Date object.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * Check if the value is a string that represents an ISO date string.
 */
export function isISODateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?(Z|[+-]\d{2}:\d{2})?$/.test(value);
}
