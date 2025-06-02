import type { Action } from 'svelte/action';
import { on } from 'svelte/events';
import type { ElementOrSelector } from '#utils/element.js';
import { getElement, getTextContent, setTextContent } from '#utils/element.js';

interface CopyAttributes {
  'on:!copy'?: (event: CustomEvent<string>) => void;
}

interface CutAttributes {
  'on:!cut'?: (event: CustomEvent<string>) => void;
}

interface PasteAttributes {
  'on:!paste'?: (event: CustomEvent<string>) => void;
}

type CopyAction = Action<HTMLElement, ElementOrSelector, CopyAttributes>;
type CutAction = Action<HTMLElement, ElementOrSelector, CutAttributes>;
type PastAction = Action<HTMLElement, ElementOrSelector, PasteAttributes>;

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
export const copy: CopyAction = (node, target?) => {
  if (!window.isSecureContext) {
    console.error(
      'Clipboard action failed: app not running in secure context, see: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard'
    );
    return {};
  }

  let targetNode = getElement(target, node);

  async function handleClick() {
    const text = getTextContent(targetNode);
    await navigator.clipboard.writeText(text);
    node.dispatchEvent(new CustomEvent('!copy', { detail: text }));
  }

  $effect(() => {
    targetNode = getElement(target, node);
    const listener = on(node, 'click', handleClick);

    return () => {
      listener();
    };
  });
};

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
export const cut: CutAction = (node, target?) => {
  if (!window.isSecureContext) {
    console.error(
      'Clipboard action failed: app not running in secure context, see: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard'
    );
    return {};
  }

  let targetNode = getElement(target, node);

  async function handleClick() {
    const text = getTextContent(targetNode);
    await navigator.clipboard.writeText(text);
    node.dispatchEvent(new CustomEvent('!cut', { detail: text }));
    setTextContent(targetNode, '');
  }

  $effect(() => {
    targetNode = getElement(target, node);
    const listener = on(node, 'click', handleClick);

    return () => {
      listener();
    };
  });
};

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
export const paste: PastAction = (node, target?) => {
  if (!window.isSecureContext) {
    console.error(
      'Clipboard action failed: app not running in secure context, see: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard'
    );
    return {};
  }
  let targetNode = getElement(target, node);

  async function handleClick() {
    const text = await navigator.clipboard.readText();
    node.dispatchEvent(new CustomEvent('!paste', { detail: text }));
    setTextContent(targetNode, text);
  }

  $effect(() => {
    targetNode = getElement(target, node);
    const listener = on(node, 'click', handleClick);

    return () => {
      listener();
    };
  });
};
