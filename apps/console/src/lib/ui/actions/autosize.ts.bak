import { tick } from 'svelte';
import type { Action } from 'svelte/action';
export const autosize: Action<HTMLTextAreaElement, { minRows: number }> = (node, options = { minRows: 3 }) => {
  node.rows = options.minRows;

  function triggerResize() {
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight}px`;
  }

  // const observer = new ResizeObserver(triggerResize);
  // observer.observe(node);

  node.addEventListener('input', triggerResize);

  tick().then(triggerResize);
  return {
    update(newOptions) {
      node.rows = newOptions.minRows;
    },
    destroy() {
      // observer.disconnect();
      node.removeEventListener('input', triggerResize);
    },
  };
};
