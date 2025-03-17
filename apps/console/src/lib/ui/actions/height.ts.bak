import type { Action } from 'svelte/action';
import type { Writable } from 'svelte/store';

export const height: Action<HTMLDivElement, Writable<number>> = (node, height) => {
  const styles = getComputedStyle(node);
  const paddings =
    (Number.parseInt(styles.paddingTop) || 0) +
    (Number.parseInt(styles.paddingBottom) || 0) +
    (Number.parseInt(styles.borderTopWidth) || 0) +
    (Number.parseInt(styles.borderBottomWidth) || 0);

  const observer = new ResizeObserver(() => {
    height.set(node.getBoundingClientRect().height - paddings);
  });

  observer.observe(node);

  return {
    update(newHeight) {
      height = newHeight;
    },
    destroy() {
      observer.disconnect();
    },
  };
};

export const scrollHeight: Action<HTMLDivElement, Writable<number>> = (node, height) => {
  const observer = new ResizeObserver(() => {
    height.set(node.scrollHeight);
  });

  observer.observe(node);

  return {
    update(newHeight) {
      height = newHeight;
    },
    destroy() {
      observer.disconnect();
    },
  };
};
