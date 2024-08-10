import { type Writable, derived, get } from 'svelte/store';

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

export const debounceAsync = (func: (...args: any) => void, wait = 300, immediate = false) => {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  return function (...args: any) {
    return new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      timer = setTimeout(() => {
        timer = undefined;
        if (!immediate) {
          Promise.resolve(func.apply(this, [...args])).then(resolve);
        }
      }, wait);
      if (immediate && !timer) {
        Promise.resolve(func.apply(this, [...args])).then(resolve);
      }
    });
  };
};

export const debouncer = <T>(store: Writable<T>, timeoutMs = 500) =>
  derived(
    store,
    ($value, set) => {
      const intervalId = setTimeout(() => set($value), timeoutMs);
      return () => clearTimeout(intervalId);
    },
    get(store),
  );
