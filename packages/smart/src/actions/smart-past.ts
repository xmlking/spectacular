/**
 * Take schema and callback function that process extracted json
 * https://github.com/skeletonlabs/skeleton/blob/dev/packages/skeleton/src/lib/actions/Clipboard/clipboard.ts
 * on:decoded
 */

import type { Action, ActionReturn } from 'svelte/action';
import type { JSONSchema7 } from 'json-schema';

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
// export const smart_past1: Action<
//   HTMLFormElement,
//   { useJs: boolean } | undefined,
//   { 'on:past': (e: CustomEvent) => void; onerror: (e: ErrorEvent) => void }
// > = (node, options = { useJs: false }) => {
//   const isCSSEnabled = CSS.supports('field-sizing', 'content');

//   function triggerResize() {
//     node.style.height = 'auto';
//     node.style.height = `${node.scrollHeight}px`;
//   }

//   if (!options.useJs && isCSSEnabled) {
//     node.style.setProperty('field-sizing', 'content');
//   } else {
//     // const observer = new ResizeObserver(triggerResize);
//     // observer.observe(node);
//     node.addEventListener('input', triggerResize);
//     tick().then(triggerResize);
//   }

//   return {
//     destroy() {
//       if (!options.useJs && isCSSEnabled) {
//         node.style.setProperty('field-sizing', 'initial');
//       } else {
//         // observer.disconnect();
//         node.removeEventListener('input', triggerResize);
//       }
//     },
//   };
// };

// const defaultPasteReg = /^-?(0|[1-9]\d*)(\.\d+)?$/;

// 	const pasteHandler = (e: Event) => {
//   if (e.target === getInputEl()) {
//     const clipboardData = (e as ClipboardEvent).clipboardData;
//     const pastedData = clipboardData?.getData('text');

//     if (pastedData && !defaultPasteReg.test(pastedData)) {
//       e.stopPropagation();
//       e.preventDefault();
//     }
//   }
// };

// https://github.com/jcarbou/jazzsvelte/blob/main/packages/key_filter_action/src/keyFilter.actions.ts
// function paste(event: ClipboardEvent) {
//   if (validateOnly) return;

//   const clipboard = event.clipboardData?.getData('text');

//   if (!clipboard) return; // loop over each letter pasted and if any fail prevent the paste
//   if (!validateText(clipboard)) {
//     event.preventDefault();
//   }
// }

// function validateText(text: string | null | undefined): boolean {
//   if (text === null || text === undefined || text.length === 0) return true;
//   if (inputElement.disabled) return false;
//   if (!keyFilterType) return true;
//   return !text.split('').find((c) => !regExp.test(c));
// }
// return {
//     destroy() {
//         inputElement.removeEventListener('keydown', keydown)
//         inputElement.removeEventListener('beforeinput', beforeinput)
//         inputElement.removeEventListener('paste', paste)
//         inputElement.removeEventListener('input', input)
//     }
// }

// on:decoded

// https://github.com/seimmuc/family_tree/blob/main/src/lib/client/clutils.ts
// https://github.com/seimmuc/family_tree/blob/a864d58342f58b4ab2fe09866fe0595172af25d6/src/lib/components/PersonInfo.svelte#L117

type Options = {
  api: string;
  schema: JSONSchema7;
};

type Attributes = {
  'on:smartPast'?: (event: CustomEvent<ClipboardEvent> & { currentTarget: HTMLFormElement }) => void;
  'on:error': (e: ErrorEvent) => void;
};

type SmartPastAction = Action<HTMLFormElement, Options | undefined, Attributes>;

/**
 * Svelte action that smart past clipboard content intp Form using AI.
 *
 * This will debounce the specified event on the element this action is bound to.
 * If the delay is exceeded, a custom "debounced" event will be dispatched.
 *
 * @param api api URI/Path e.g., `/api/smartpast`
 * @param schema JSON Schema of the Form
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *     import { smartPast } from "@spectacular/smart/actions";
 *   let newFormData = '';
 * </script>
 * <input
 *   use:smartPast={{api: '/api/smartpast', schema}}
 *   on:smartPast={ (e) => newFormData = e.currentTarget.value}
 * />
 * <p>New FormData: {newFormData}</p>
 * ```
 */
export const smartPast: SmartPastAction = (node, options) => {
  if (!window.isSecureContext) {
    console.error(
      'Clipboard action failed: app not running in secure context, see: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard',
    );
    return {};
  }
  const useLocalLocal = async (event: Event) => {
    console.log(options?.api);
    console.log(options?.schema);
  };
  const useRemoteModel = async (event: Event) => {
    console.log(options?.api);
    console.log(options?.schema);
  };
  const handleSmartPast = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text');
    if (text && text.length > 0) {
      event.preventDefault();
      console.log({ text });
      window.aibrow?.coreModel ? useLocalLocal(event) : useRemoteModel(event);

      node.dispatchEvent(new CustomEvent('smartPast', { detail: text }));
      node.dispatchEvent(
        new ErrorEvent('error', {
          error: new Error('AAAHHHH'),
          message: 'A monkey is throwing bananas at me!',
          lineno: 402,
          colno: 33,
          filename: 'closet.html',
        }),
      );
    }
  };

  node.addEventListener('paste', handleSmartPast);
  return {
    update(newArgs) {
      console.log({ newArgs });
    },
    destroy() {
      node.removeEventListener('paste', handleSmartPast);
    },
  };
};
