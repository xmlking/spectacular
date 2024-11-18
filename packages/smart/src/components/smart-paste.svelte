<script lang="ts">
import { clipboard } from '@skeletonlabs/skeleton';
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { chromeai } from 'chrome-ai';
import { writable } from 'svelte/store';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import { createEventDispatcher } from 'svelte';
import { z } from 'zod';
const dispatch = createEventDispatcher();
interface $$Props extends HTMLTextareaAttributes {
  selected?: any;
}
const log = new Logger('experiments:ai:ms:browser');
const api = '/api/smartpaste';
let isLoading = false;
let error: string;
const options = writable([]);

let value = '';
// TODO: useObject is not yet supported for svelte https://sdk.vercel.ai/docs/ai-sdk-ui/overview
const useRemoteModel = async (event: Event) => {
  try {
    isLoading = true;
    const rawResponse = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    const content = await rawResponse.json();
    if (content) {
      dispatch('pasted', content);
    }
    console.log(JSON.stringify(content));
    isLoading = false;
  } catch (err) {
    console.log(err);
    error = `${err}`;
  } finally {
    isLoading = false;
  }
};
const phoneRegex = /^\+[1-9]\d{1,14}$/;
const useLocalLocal = async (event: Event) => {
  try {
    isLoading = true;
    const content = await generateObject({
      model: chromeai('text'),
      system: 'You are a contact information extracter.',
      prompt: `Extract the following contact details from the provided text: firstName, lastName, phoneNumber, line1, line2, city, state, zip, and country. If a full name is given, split it into firstName and lastName. Return the extracted details in JSON format  Extract the following details from the data:\n ${value}`,
      schema: z.object({
        firstName: z.string().nullish(),
        lastName: z.string().nullish(),
        phoneNumber: z.string().nullish(),
        line1: z.string().nullish(),
        line2: z.string().nullish(),
        city: z.string().nullish(),
        state: z.string().nullish(),
        zip: z.string().nullish(),
        country: z.string().nullish(),
      }),
    });
    if (content) {
      dispatch('pasted', content.object);
      error = '';
    }
    isLoading = false;
  } catch (err) {
    log.error(err);
    if (TypeValidationError.isInstance(err)) {
      error = `${err.value}`;
    } else if (JSONParseError.isInstance(err)) {
      error = `${err.text}`;
    } else {
      error = `${err}`;
    }
  } finally {
    isLoading = false;
  }
};
async function pasteData(event: Event) {
  event.preventDefault();
  const clipboardData = await navigator.clipboard.readText();
  value = clipboardData;
  console.log(value);
  // window.ai?.languageModel ? await useLocalLocal(event) : await useRemoteModel(event);
  window.ai?.assistant ? await useLocalLocal(event) : await useRemoteModel(event);
}
</script>

<form class="flex flex-col items-center">
  <button on:click={pasteData} class="variant-ghost-success btn ml-auto"
    >Smart Paste</button
  >
  <ErrorMessage {error} />
</form>
