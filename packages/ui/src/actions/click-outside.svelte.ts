import { on } from 'svelte/events';
import type { Action } from 'svelte/action';

type Options = {
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
  include?: HTMLElement[];
};

type ClickOutsideAction = Action<HTMLElement, Options | undefined>;

/**
 * Svelte Action: clickOutside
 *
 * @param onClickOutside callback function
 * @param include Allow components to whitelist elements to ignore
 * - little extra functionality here allows components to pass in other DOM elements that should be considered as “inside” the action (rather than “outside”).
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { clickOutside } from "$lib/actions";
 *   let counter = $state(0);
 *
 *  function onClickOutside() {
 *    counter++
 *  }
 * </script>
 *
 * <div use:clickOutside={{onClickOutside}}>
 *   <p>click ourside this box</p>
 * </div>
 * ```
 */
export const clickOutside: ClickOutsideAction = (node, _options = {}) => {
  // fallback to noop function and empty `include` array
  const options = { include: [], onClickOutside: () => {}, ..._options };

  const detect = (event: MouseEvent | TouchEvent) => {
    if (
      (node && !node.contains(event.target as Node)) ||
      options.include.some((i) => (event.target as Node).isSameNode(i))
    ) {
      options.onClickOutside(event);
      // node.dispatchEvent(new CustomEvent("clickoutside"));
    }
  };

  $effect(() => {
    // The event listener is using passive to avoid scrolling performance issues, and capture to make sure that all clicks bubble up to the listener.
    const click = on(document, 'click', detect, { passive: true, capture: true });
    const touchstart = on(document, 'touchstart', detect, { passive: true, capture: true });

    return () => {
      click();
      touchstart();
    };
  });
};
