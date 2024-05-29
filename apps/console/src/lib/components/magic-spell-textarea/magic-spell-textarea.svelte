<script lang="ts">
import { getToastStore } from '@skeletonlabs/skeleton';
import { AutoResizeTextarea } from '@spectacular/skeleton/components/auto-resize-textarea';
import { Logger } from '@spectacular/utils';
import { useCompletion } from 'ai/svelte';
import { AlertTriangle, Sparkles } from 'lucide-svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import { fade } from 'svelte/transition';

import { handleMessage } from '$lib/components/layout/toast-manager';
import { onMount } from 'svelte';
import { default as LoaderIcon } from './loader-icon.svelte';

const log = new Logger('experiments:ai:ms:browser');
const toastStore = getToastStore();
const api = '/api/completion';

/* FIXME */
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
interface $$Props extends HTMLTextareaAttributes {
  value?: any;
}

export let value = '';

/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
const { complete, completion, input, isLoading, handleSubmit, error, stop } = useCompletion({
  api,
  body: { text: value },
  onFinish: (_prompt, completion) => {
    value = completion.trim();
  },
  onError: (error) => handleMessage({ type: 'error', message: error.message }, toastStore),
});

// callbacks
function handleChange(e: Event) {
  // if (!$isLoading)
  value = (e.target as HTMLSelectElement)?.value;
}

function handleSubmitWrap(e: SubmitEvent) {
  e.preventDefault();
  log.debug({ value });
  handleSubmit(e);
  input.set('');
}

onMount(() => {
  //  complete('some example prompt', {body: {text: 'eeee'}});
});
</script>

<form
  class="flex flex-col items-center"
  on:submit={handleSubmitWrap}
>
  <AutoResizeTextarea
    {...$$props}
    maxRows={100}
    minRows={4}
    disabled={$isLoading}
    value={$isLoading && $completion.length > 0 ? $completion.trim() : value}
    on:change={handleChange}
  />
  <div class="z-10 -mt-5">
    <fieldset disabled={$isLoading} class="input-group input-group-divider grid-cols-[1fr_auto]">
      <input
      type="search"
      class="input"
      placeholder="paraphrase it..."
      bind:value={$input}
      aria-label="Prompt"
      required />
      <button
      type="submit"
      class="variant-filled-secondary"
      aria-label="Submit">
        {#if $isLoading}
          <LoaderIcon />
        {:else}
          <Sparkles />
        {/if}
      </button>
    </fieldset>
    <!-- TODO: this block is redundant as we are poping toast messages via onError() -->
    {#if $error}
      <aside class="alert mt-6 variant-filled-error" transition:fade|local={{ duration: 200 }}>
        <!-- Icon -->
        <AlertTriangle />
        <!-- Message -->
        <div class="alert-message">
          {#if $error}
            <p class="font-medium">{$error.message}</p>
          {/if}
        </div>
        <!-- Actions -->
      </aside>
    {/if}
  </div>
  <!-- <button type="button" class="btn variant-filled" on:click={stop} disabled={!$isLoading}>Stop</button> -->
</form>
