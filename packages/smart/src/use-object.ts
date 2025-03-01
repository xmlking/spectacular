// Usage: https://github.com/vercel/ai/issues/2902#issuecomment-2682643650
import { type FetchFunction, isAbortError, safeValidateTypes } from '@ai-sdk/provider-utils';
import { asSchema, isDeepEqualData, parsePartialJson, type Schema, type DeepPartial } from '@ai-sdk/ui-utils';
import z from 'zod';
import { writable, type Writable } from 'svelte/store';

// use function to allow for mocking in tests:
const getOriginalFetch = () => fetch;

export type Experimental_UseObjectOptions<RESULT> = {
  /**
   * The API endpoint. It should stream JSON that matches the schema as chunked text.
   */
  api: string;

  /**
   * A Zod schema that defines the shape of the complete object.
   */
  schema: z.Schema<RESULT, z.ZodTypeDef, any> | Schema<RESULT>;

  /**
   * An unique identifier. If not provided, a random one will be
   * generated. When provided, the `useObject` hook with the same `id` will
   * have shared states across components.
   */
  id?: string;

  /**
   * An optional value for the initial object.
   */
  initialValue?: DeepPartial<RESULT>;

  /**
   * Custom fetch implementation. You can use it as a middleware to intercept requests,
   * or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: FetchFunction;

  /**
   * Callback that is called when the stream has finished.
   */
  onFinish?: (event: {
    /**
     * The generated object (typed according to the schema).
     * Can be undefined if the final object does not match the schema.
     */
    object: RESULT | undefined;

    /**
     * Optional error object. This is e.g. a TypeValidationError when the final object does not match the schema.
     */
    error: Error | undefined;
  }) => Promise<void> | void;

  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: (error: Error) => void;

  /**
   * Additional HTTP headers to be included in the request.
   */
  headers?: Record<string, string> | Headers;
};

export type Experimental_UseObjectHelpers<RESULT, INPUT> = {
  /**
   * Calls the API with the provided input as JSON body.
   */
  submit: (input: INPUT) => void;

  /**
   * The current value for the generated object. Updated as the API streams JSON chunks.
   */
  object: Writable<DeepPartial<RESULT> | undefined>;

  /**
   * The error object of the API request if any.
   */
  error: Writable<Error | undefined>;

  /**
   * Flag that indicates whether an API request is in progress.
   */
  isLoading: Writable<boolean>;

  /**
   * Abort the current request immediately, keep the current partial object if any.
   */
  stop: () => void;
};

function useObject<RESULT, INPUT = any>({
  api,
  schema, // required, in the future we will use it for validation
  initialValue,
  fetch,
  onError,
  onFinish,
  headers,
}: Experimental_UseObjectOptions<RESULT>): Experimental_UseObjectHelpers<RESULT, INPUT> {
  // Replace useSWR: create svelte store
  const object = writable<DeepPartial<RESULT> | undefined>(initialValue);
  const error = writable<Error | undefined>(undefined);
  const isLoading = writable(false);

  // Replace useRef with a simple local variable for the AbortController.
  let abortController: AbortController | null = null;

  // stop: an arrow function to abort the API call.
  const stop = () => {
    try {
      abortController?.abort();
    } catch (ignored) {
      // ignore errors on abort
    } finally {
      isLoading.set(false);
      abortController = null;
    }
  };

  // submit: calls the API and updates state as chunks are received.
  const submit = async (input: INPUT) => {
    try {
      // Reset the current object
      object.set(undefined);
      isLoading.set(true);
      error.set(undefined);

      abortController = new AbortController();

      const actualFetch = fetch ?? getOriginalFetch();
      const response = await actualFetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: abortController.signal,
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error((await response.text()) ?? 'Failed to fetch the response.');
      }

      if (response.body == null) {
        throw new Error('The response body is empty.');
      }

      let accumulatedText = '';
      let latestObject: DeepPartial<RESULT> | undefined = undefined;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          const { value: parsedValue } = parsePartialJson(accumulatedText);
          const currentObject = parsedValue as DeepPartial<RESULT>;

          if (!isDeepEqualData(latestObject, currentObject)) {
            latestObject = currentObject;
            object.set(currentObject);
          }
        }
      }

      // Finalize the stream
      isLoading.set(false);
      abortController = null;

      if (onFinish != null) {
        const validationResult = safeValidateTypes({
          value: latestObject,
          schema: asSchema(schema),
        });

        onFinish(
          validationResult.success
            ? { object: validationResult.value, error: undefined }
            : { object: undefined, error: validationResult.error },
        );
      }
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }

      if (onError && err instanceof Error) {
        onError(err);
      }

      isLoading.set(false);
      error.set(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return {
    submit,
    object,
    error,
    isLoading,
    stop,
  };
}

export const experimental_useObject = useObject;
