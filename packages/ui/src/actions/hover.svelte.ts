import type { Action } from 'svelte/action';
import { on } from 'svelte/events';
import type { Writable } from 'svelte/store';

type Parameter = Writable<boolean>;

/**
 * Svelte action that update hover state.
 *
 * @param value the hover state
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const hovered = writable(false);
 * </script>
 * <div use:hover={hovered}>
 * ```
 */
export const hover: Action<HTMLElement, Parameter> = (element, value: Parameter) => {
  $effect(() => {
    const mouseenter = on(element, 'mouseenter', () => value.set(true));
    const mouseleave = on(element, 'mouseleave', () => value.set(false));

    return () => {
      mouseenter();
      mouseleave();
    };
  });
};
