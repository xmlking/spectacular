/**
 * HINT: useing CSS if `field-sizing: content` is avaiable.
 */
import { tick } from 'svelte';
import type { Action } from 'svelte/action';
export const autosize: Action<HTMLTextAreaElement, { useJs: boolean } | undefined> = (
  node,
  options = { useJs: false }
) => {
  const isCSSEnabled = CSS.supports('field-sizing', 'content');

  function triggerResize() {
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight}px`;
  }

  if (!options.useJs && isCSSEnabled) {
    node.style.setProperty('field-sizing', 'content');
  } else {
    // const observer = new ResizeObserver(triggerResize);
    // observer.observe(node);
    node.addEventListener('input', triggerResize);
    tick().then(triggerResize);
  }

  return {
    destroy() {
      if (!options.useJs && isCSSEnabled) {
        node.style.setProperty('field-sizing', 'initial');
      } else {
        // observer.disconnect();
        node.removeEventListener('input', triggerResize);
      }
    },
  };
};
