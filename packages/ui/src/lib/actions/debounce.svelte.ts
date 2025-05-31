import type { Action } from 'svelte/action';
import { on } from 'svelte/events';

type Options = {
  delay?: number;
  eventTypeToDebounce?: string;
};

type Attributes = {
  'on:debounced'?: (event: InputEvent & { currentTarget: HTMLInputElement }) => void;
};

type DebounceAction = Action<HTMLInputElement, Options | undefined, Attributes>;

/**
 * Svelte action that debounces an event.
 *
 * This will debounce the specified event on the element this action is bound to.
 * If the delay is exceeded, a custom "debounced" event will be dispatched.
 *
 * @param delay in ms
 * @param eventTypeToDebounce event type: 'input', 'keydown' etc...
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { debounce } from "$lib/actions";
 *   let debouncedValue = '';
 * </script>
 * <input
 *   use:debounce={{delay: 200, eventTypeToDebounce: 'keydown'}}
 *   ondebounced={ (e) => debouncedValue = e.currentTarget.value}
 * />
 * <p>Debounced value: {debouncedValue}</p>
 * ```
 */
export const debounce: DebounceAction = (node, _options = {}) => {
  const options = { delay: 300, eventTypeToDebounce: 'input', ..._options };

  let timeoutId: ReturnType<typeof setTimeout>;

  const handleDebounce = (event: Event) => {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('debounced', event));
    }, options.delay);
  };

  $effect(() => {
    const listener = on(node, options.eventTypeToDebounce, handleDebounce);

    return () => {
      clearTimeout(timeoutId);
      listener();
    };
  });
};
