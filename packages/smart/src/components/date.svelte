<!--
@component SmartDate - Interpret the given natural language string as a specific date and time using On-Device AI
  @prop {string} value - 	Selected value(s)
  @prop {string[]} items - Array of items available to display / filter
  @prop {number} debounceWait - milliseconds debounce wait
  @prop {string} name - Name attribute of hidden input, helpful for form actions
  @slot prepend - prepend
  @slot clear-icon - clear-icon

  Usage:
  ```svelte
    <SmartDate
      bind:value={$formData.specialization}
      {...$constraints.specialization}
      api={'/api/date'}
    />
  ```
-->
<script lang="ts">
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { chromeai } from 'chrome-ai';
import { Sparkles } from 'lucide-svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { z } from 'zod';
import { default as LoaderIcon } from './loader-icon.svelte';

interface $$Props extends HTMLInputAttributes {
  value?: string | null;
  name?: string | null;
  api?: Readonly<string>;
}

// Props
export let value: string | null = null;
export let name: string | null = null;
export let api: string = '/api/date';

// Variables
const log = new Logger('ai:date:browser');
let prompt = '';
let loading = false;
let error: string;
const controller = new AbortController();

// Functions
const useRemoteModel = async (event: SubmitEvent) => {
  try {
    loading = true;
    const rawResponse = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const content = await rawResponse.json();
    if (content.date) {
      value = content.date.slice(0, 16);
      //value =  new Date().toISOString().slice(0,16)
      prompt = '';
    }
    loading = false;
  } catch (err) {
    log.error(err);
    error = `${err}`;
  } finally {
    loading = false;
  }
};

const grammar = {
  type: 'object',
  properties: {
    predicted_date: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['predicted_date'],
  additionalProperties: false,
};

const useLocalLocal = async (event: SubmitEvent) => {
  let session;
  try {
    loading = true;

    session = await self.aibrow.coreModel.create({ grammar, model: undefined });
    const resp = await session.prompt(
      `The current ISO datetime is: ${new Date().toISOString()}. Extract the data from the following: ${prompt}`,
    );
    log.debug(resp);

    const predicted_date = JSON.parse(resp)?.predicted_date;
    value = predicted_date.slice(0, 16);
    prompt = '';
    loading = false;
  } catch (err) {
    log.error(err);
    error = `${err}`;
  } finally {
    session?.destroy();
    loading = false;
  }
};
</script>

<form
  class="flex flex-col items-center"
  on:submit|preventDefault={(event) => {
    self.aibrow?.coreModel ? useLocalLocal(event) : useRemoteModel(event);
  }}
>
  <input
    type="datetime-local"
    {...$$props}
    {name}
    class="input"
    disabled={loading}
    bind:value
  />

  <div class="z-10 -translate-y-1/4 w-1/2">
    <fieldset
      disabled={loading}
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
        {#if loading}
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
