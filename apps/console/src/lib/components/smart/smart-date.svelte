<script lang="ts">
import { getChromeAI } from '$lib/stores/chrome-ai';
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { chromeai } from 'chrome-ai';
import { Sparkles } from 'lucide-svelte';
import { z } from 'zod';
import { default as LoaderIcon } from './loader-icon.svelte';

const log = new Logger('experiments:ai:ms:browser');
const api = '/api/date';
const { isAISupported, assistantAvailability } = getChromeAI();

export let value = '';
let prompt = '';
let isLoading = false;
let error: string;

// TODO: useObject is not yet supported for svelte https://sdk.vercel.ai/docs/ai-sdk-ui/overview
const useRemoteModel = async (event: SubmitEvent) => {
  try {
    isLoading = true;
    const rawResponse = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const content = await rawResponse.json();
    console.log();
    if (content.date) {
      value = content.date.slice(0, 16);
      //value =  new Date().toISOString().slice(0,16)
      prompt = '';
    }
    isLoading = false;
  } catch (err) {
    log.error(err);
    error = `${err}`;
  } finally {
    isLoading = false;
  }
};

const useLocalLocal = async (event: SubmitEvent) => {
  try {
    isLoading = true;
    const {
      object: { date },
      rawResponse,
    } = await generateObject({
      model: chromeai('text'),
      system: 'You are a javascript data object generator',
      prompt: `The current date is: ${new Date()} \nGenerate date in format: 'YYYY-MM-DD HH:mm' from text: date of ${prompt}`,
      schema: z.object({
        // date: z.string().date().transform(value => new Date(value)),
        date: z.coerce.date().describe('local DateTime with timezone'),
      }),
    });
    log.debug({ date });

    if (date) {
      value = date.toISOString().slice(0, 16);
      prompt = '';
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
const onSubmit = useLocalLocal;
</script>

<form
  class="flex flex-col items-center"
  on:submit|preventDefault={(event) => {
    $assistantAvailability === 'readily' ? useLocalLocal(event) : useRemoteModel(event);
  }}
>
  <input
    type="datetime-local"
    {...$$props}
    class="input"
    disabled={isLoading}
    {value}
  />

  <div class="z-10 -mt-5 w-1/2">
    <fieldset
      disabled={isLoading}
      class="input-group input-group-divider grid-cols-[1fr_auto]"
    >
      <input
        type="search"
        class="input"
        placeholder="paraphrase it..."
        bind:value={prompt}
        aria-label="Prompt"
        required
      />
      <button
        type="submit"
        class="variant-filled-secondary"
        aria-label="Submit"
      >
        {#if isLoading}
          <LoaderIcon />
        {:else}
          <Sparkles />
        {/if}
      </button>
    </fieldset>
    <!-- TODO: this block is redundant as we are poping toast messages via onError() -->
    <ErrorMessage {error} />
  </div>
</form>
