<script lang="ts">
import { AutoResizeTextarea } from '@spectacular/skeleton/components/auto-resize-textarea';
import { Logger } from '@spectacular/utils';
import { useCompletion } from 'ai/svelte';
import { Sparkles } from 'lucide-svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import { default as LoaderIcon } from './loader-icon.svelte';

const log = new Logger('experiments:ai:ms:browser');
const api = '/api/completion';

/* FIXME */
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
interface $$Props extends HTMLTextareaAttributes {
  value?: any;
}

export let value = '';

/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
const { complete, completion, input, isLoading, handleSubmit, stop } = useCompletion({
  api,
  onFinish: (_prompt, completion) => {
    value = completion.trim();
  },
  onError: (error) => log.error(error.message),
});

// callbacks
</script>

<form
  class="flex flex-col items-center"
  on:submit={(e) => {
    handleSubmit(e);
    input.set('');
  }}
>
  <AutoResizeTextarea
    {...$$props}
    maxRows={100}
    minRows={4}
    aria-label="Text"
    value={$isLoading && $completion.length > 0 ? $completion.trim() : value}
    on:change={(event) => {
      if (!$isLoading) value = event.target?.value;
      console.log(value);
    }}
  />
  <div class="z-10 -mt-5">
    <div class="input-group input-group-divider grid-cols-[1fr_auto]">
      <input type="search" placeholder="paraphrase it..." bind:value={$input} aria-label="Prompt" required />
      <button type="submit" aria-label="Submit" class="variant-filled-secondary">
        <svelte:component this={$isLoading ? LoaderIcon : Sparkles} /></button
      >
    </div>
  </div>
  <!-- <button type="button" class="btn variant-filled" on:click={stop} disabled={!$isLoading}>Stop</button> -->
</form>
