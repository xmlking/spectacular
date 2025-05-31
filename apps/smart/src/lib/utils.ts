export const isBrowser = typeof document !== 'undefined';

export function updateTheme(activeTheme: string, path: string) {
  if (!isBrowser) return;
  for (const className of document.body.classList) {
    if (className.match(/^theme.*/)) {
      document.body.classList.remove(className);
    }
  }

  const theme = path === '/themes' ? activeTheme : null;
  if (theme) {
    return document.body.classList.add(`theme-${theme}`);
  }
}
