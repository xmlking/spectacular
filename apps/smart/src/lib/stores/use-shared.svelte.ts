// See https://dev.to/jdgamble555/using-sharable-runes-with-typescript-in-svelte5-5hcp

import { getContext, hasContext, setContext } from 'svelte';

export const useSharedStore = <T, A>(name: string, fn: (value?: A) => T, initialValue?: A) => {
  if (hasContext(name)) {
    return getContext<T>(name);
  }
  if (initialValue === undefined) {
    throw new Error(
      `Readable store "${name}" is not found, or is being created without initialValue.`
    );
  }
  const _value = fn(initialValue);
  return setContext(name, _value);
};
