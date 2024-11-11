import type { Action } from 'svelte/action';

/**
 * Pastes the text content of the clipboard to `target` when `node` is clicked.
 * If `target` is not provided, the clipboard contents are pasted to `node`'s textContent. When `target` is a string, it is used as a query selector.
 * Also dispatches a `!paste` event on 'node' with the pasted text as `detail`.
 * When `target` is an input or textarea, its value is pasted. Otherwise, textContent is pasted.
 *
 * Example:
 * ```svelte
 * <input id="input" bind:this={targetElement} />
 * <button use:paste={"#input"} on:!paste={handler} />
 * <button use:paste={targetElement} />
 * <p use:paste />
 *```
 */
// https://github.com/nikolai-cc/svu/blob/main/src/lib/action/clipboard.ts
const smart_past: Action<HTMLFormElement, null, { onpast: (e: CustomEvent) => void; onerror: (e: ErrorEvent) => void; }> = (node) => {
  // the node has been mounted in the DOM

  $effect(() => {
    // setup goes here
    node.dispatchEvent(new CustomEvent('onpast', {detail: {a: 1, b:2}, composed: false, bubbles: true}));

    node.dispatchEvent(new ErrorEvent('error', { message : 'A monkey is throwing bananas at me!', error : new Error('AAAHHHH'), lineno : 402, composed: false, bubbles: true}));

    return () => {
      // teardown goes here
    };
  });
}

// for (const el of formElement.querySelectorAll<HTMLInputElement>('input,select,textarea,button')) { }
