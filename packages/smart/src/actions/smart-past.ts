/**
 * Take schema and callback function that process extracted json
 * https://github.com/skeletonlabs/skeleton/blob/dev/packages/skeleton/src/lib/actions/Clipboard/clipboard.ts
 * on:decoded
 */
import { tick } from 'svelte';
import type { Action, ActionReturn } from 'svelte/action';
export const smartPast: Action<HTMLElement, { useJs: boolean } | undefined> = (node, options = { useJs: false }) => {
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
export const nonewlines: Action<HTMLElement, undefined, { 'on:returnkey': (e: CustomEvent<KeyboardEvent>) => void }> = (
  node: HTMLElement,
) => {
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      node.dispatchEvent(new CustomEvent('returnkey', { detail: e }));
    }
  }
  function onPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text');
    if (text?.includes('\n')) {
      e.preventDefault();
    }
  }
  node.addEventListener('keydown', onKeydown);
  node.addEventListener('paste', onPaste);
  return {
    destroy() {
      node.removeEventListener('keydown', onKeydown);
      node.removeEventListener('paste', onPaste);
    },
  };
};
