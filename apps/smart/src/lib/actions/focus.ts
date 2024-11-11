import type { Action } from 'svelte/action';

export const focusElement: Action<HTMLElement> = (node) => {
  node.focus();
};
