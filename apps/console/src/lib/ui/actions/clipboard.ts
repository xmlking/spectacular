import { getElement, getTextContent, setTextContent } from '$lib/ui/utils';

import type { ActionReturn } from 'svelte/action';
import type { ElementOrSelector } from '$lib/ui/utils';

interface CopyAttributes {
  'on:!copy'?: (event: CustomEvent<string>) => void;
}

interface CutAttributes {
  'on:!cut'?: (event: CustomEvent<string>) => void;
}

interface PasteAttributes {
  'on:!paste'?: (event: CustomEvent<string>) => void;
}

/**
 * Copies the text content of `target` to the clipboard when `node` is clicked.
 * If `target` is not provided, `node`'s textContent is copied. When `target` is a string, it is used as a query selector.
 * Also dispatches a `!copy` event on 'node' with the copied text as `detail`.
 * When `target` is an input or textarea, its value is copied. Otherwise, textContent is copied.
 *
 * Example:
 * ```svelte
 * <input id="input" value="Some value" bind:this={targetElement} />
 * <button use:copy={"#input"} on:!copy={handler} />
 * <button use:copy={targetElement} />
 * <p use:copy>Some text</p>
 *```
 */
export function copy(node: HTMLElement, target?: ElementOrSelector): ActionReturn<ElementOrSelector, CopyAttributes> {
  let targetNode = getElement(target, node);

  async function handleClick() {
    const text = getTextContent(targetNode);
    await navigator.clipboard.writeText(text);
    node.dispatchEvent(new CustomEvent('!copy', { detail: { text } }));
  }

  node.addEventListener('click', handleClick);

  return {
    update: (newTarget: ElementOrSelector) => {
      targetNode = getElement(newTarget, node);
    },
    destroy: () => node.removeEventListener('click', handleClick),
  };
}

/**
 * Cuts the text content of `target` to the clipboard when `node` is clicked.
 * If `target` is not provided, `node`'s textContent is cut. When `target` is a string, it is used as a query selector.
 * Also dispatches a `!cut` event on 'node' with the cut text as `detail`.
 * When `target` is an input or textarea, its value is cut. Otherwise, textContent is cut.
 * The original value or textArea is replaced with an empty string.
 *
 * Example:
 * ```svelte
 * <input id="input" value="Some value" bind:this={targetElement} />
 * <button use:cut={"#input"} on:!cut={handler} />
 * <button use:cut={targetElement} />
 * <p use:cut>Some text</p>
 *```
 */
export function cut(node: HTMLElement, target?: ElementOrSelector): ActionReturn<ElementOrSelector, CutAttributes> {
  let targetNode = getElement(target, node);

  async function handleClick() {
    const text = getTextContent(targetNode);
    await navigator.clipboard.writeText(text);
    node.dispatchEvent(new CustomEvent('!cut', { detail: text }));
    setTextContent(targetNode, '');
  }

  node.addEventListener('click', handleClick);

  return {
    update: (newTarget: ElementOrSelector) => {
      targetNode = getElement(newTarget, node);
    },
    destroy: () => node.removeEventListener('click', handleClick),
  };
}

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
export function paste(node: HTMLElement, target?: ElementOrSelector): ActionReturn<ElementOrSelector, PasteAttributes> {
  let targetNode = getElement(target, node);

  async function handleClick() {
    const text = await navigator.clipboard.readText();
    node.dispatchEvent(new CustomEvent('!paste', { detail: text }));
    setTextContent(targetNode, text);
  }

  node.addEventListener('click', handleClick);

  return {
    update: (newTarget: ElementOrSelector) => {
      targetNode = getElement(newTarget, node);
    },
    destroy: () => node.removeEventListener('click', handleClick),
  };
}
