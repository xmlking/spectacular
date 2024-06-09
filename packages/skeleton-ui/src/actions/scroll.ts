import type { Action } from 'svelte/action';
import type { Writable } from 'svelte/store';
/**
<script lang="ts">
  export let scroll_height: Writable<number>;
  let top = writable(0);

  function scroll_up() {
    $top = clamp($top - 32 - 4, 0, max_scroll);
  }
  function scroll_down() {
    $top = clamp($top + 32 + 4, 0, max_scroll);
  }
</script>

  <div class:scrollable use:scrollHeight={scroll_height} use:scrollTop={top}>
 */
export const scrollTop: Action<HTMLDivElement, Writable<number>> = (node, value) => {
  const listener = (top: number) => {
    node.scrollTo({ top, behavior: 'smooth' });
  };

  let timer = 0;

  function on_scroll() {
    clearTimeout(timer);
    timer = window.setTimeout(() => value.set(node.scrollTop), 200);
  }

  node.addEventListener('scroll', on_scroll);

  let unsubscribe = value.subscribe(listener);

  return {
    update(newValue) {
      unsubscribe();
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      unsubscribe = (value = newValue).subscribe(listener);
    },
    destroy() {
      clearTimeout(timer);
      node.removeEventListener('scroll', on_scroll);
      unsubscribe();
    },
  };
};
