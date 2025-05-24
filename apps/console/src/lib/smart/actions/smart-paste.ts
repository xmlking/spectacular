import type { Action } from 'svelte/action';
import type { Writable } from 'svelte/store';
import type { JSONSchema } from 'sveltekit-superforms';

type Options<T extends Item = Item> = {
  api: string;
  jsonSchema: JSONSchema; // TODO: schema of type T
  loading?: Writable<boolean>;
  useLocal?: boolean;
};

export declare type Item = Record<string, any>;

type Attributes<T> = {
  'on:smartPaste': (event: CustomEvent<T> & { currentTarget: HTMLFormElement }) => void;
  'on:smartError': (event: CustomEvent<Error>) => void;
};

type SmartPasteAction<T extends Item> = Action<HTMLFormElement, Options<T> | undefined, Attributes<T>>;

/**
 * Svelte action that smart paste clipboard content intp Form using AI.
 *
 * This will debounce the specified event on the element this action is bound to.
 * If the delay is exceeded, a custom "debounced" event will be dispatched.
 *
 * @param api api URI/Path e.g., `/api/smartpaste`
 * @param jsonSchema JSON Schema of the Form
 * @param loading loading state to indicate to users in UI
 * @param useLocal use on-device AI model? default: false
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { smartPaste } from "$lib/smart/actions";
 *   let loading = writable(false);
 *   const jsonSchema = zod(personSchema).jsonSchema;
 *
 *  function handlePaste(event: CustomEvent<Person>) {
 *   const { detail } = event;
 *   $formData.firstName = detail.firstName;
 *   $formData.lastName = detail.lastName;
 *   $formData.phoneNumber = detail.phoneNumber;
 *   $formData.email = detail.email;
 *   $formData.line1 = detail.line1;
 * }
 * </script>
 * <form
 *   method="POST"
 *   class="card shadow-lg"
 *   use:enhance
 *   on:smartPaste={handlePaste}
 *   on:smartError={handleError}
 *   use:smartPaste={{api: '/api/smartpaste', loading, jsonSchema, useLocal }}
 * >
 * <p>loading: {$loading}</p>
 * ```
 */
// export function smartPaste<T extends Item>(node: HTMLElement, options: Options<T>): ActionReturn<Options<T>, Attributes<T>> {
export const smartPaste: SmartPasteAction<Item> = (node, options) => {
  // Ensure options are provided
  if (!options) {
    throw new Error('Options are required for the smartPast action');
  }

  let { api, jsonSchema, loading, useLocal = false } = options;

  if (!window.isSecureContext) {
    console.error(
      'Clipboard action failed: app not running in secure context, see: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard',
    );
    return {};
  }
  const useLocalLocal = async <T>(content: string) => {
    const session = await self.LanguageModel.create();
    const prompt = `Extract the data from the following: ${content}`;
    const output = await session.prompt(prompt, { responseConstraint: jsonSchema });
    session?.destroy();
    return JSON.parse(output) as T;
  };

  const useRemoteModel = async <T>(content: string) => {
    const response = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw (await response.json()) as Error;
    }
    return (await response.json()) as T;
  };

  const handleSmartPaste = async (event: ClipboardEvent) => {
    try {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;
      loading?.set(true);
      const content = clipboardData.getData('text');
      event.preventDefault();
      const detail = useLocal && self.LanguageModel ? await useLocalLocal(content) : await useRemoteModel(content);
      // Dispatch a custom event upon successful paste
      node.dispatchEvent(new CustomEvent('smartPaste', { detail }));
    } catch (error) {
      // Dispatch an error event
      node.dispatchEvent(
        new CustomEvent('smartError', { bubbles: false, cancelable: true, composed: false, detail: error as Error }),
      );
    } finally {
      loading?.set(false);
    }
  };

  node.addEventListener('paste', handleSmartPaste);
  return {
    update(newArgs) {
      // HINT: update this code if any new mutable options are added
      useLocal = newArgs?.useLocal ?? false;
    },
    destroy() {
      node.removeEventListener('paste', handleSmartPaste);
    },
  };
};
