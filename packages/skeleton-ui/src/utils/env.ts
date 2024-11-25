/** Returns true in browser, false when prerendering / running in node. */
export const browser = typeof window !== 'undefined' && window.document;

declare const __SVELTEKIT_DEV__: boolean | undefined;
declare const __SVU_DEV__: boolean | undefined;

function checkDev() {
  if (typeof __SVELTEKIT_DEV__ !== 'undefined') return __SVELTEKIT_DEV__;
  if (typeof __SVU_DEV__ !== 'undefined') return __SVU_DEV__;
  if (typeof process.env.NODE_ENV !== 'undefined') return process.env.NODE_ENV === 'development';
  return false;
}

/**
 * Returns true in development mode, false in production. This works automagically when using SvelteKit.
 * When not using SvelteKit, you can set the __SVU_DEV__ global variable to true in dev mode.
 * Using vite, you can use [config.define](https://vitejs.dev/config/shared-options.html#define) to achieve this, your .
 */
export const dev = checkDev();
