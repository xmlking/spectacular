<script lang="ts">
import { clipboard } from '@skeletonlabs/skeleton';
import { Copy, ThumbsUp, ArrowUpFromLine } from 'lucide-svelte';
import { createEventDispatcher } from 'svelte';

// Props
export let loading: boolean;
export let header: string;
export let placeholder: string;
export let completion: string;
export let error: string;

// Variables
let copied: boolean;
const dispatch = createEventDispatcher();
</script>

<div class="card variant-soft mt-4">
  {#if error}
    <header class="card-header text-error-500">{error}</header>
    <section class="p-4 md:p-8 whitespace-pre-line"></section>
    <footer class="card-footer"></footer>
  {:else}
    {#if loading}
      <header class="card-header text-surface-500">{placeholder}</header>
    {:else}
      <header class="card-header font-semibold">{header}</header>
    {/if}
    {#if completion}
      <section class="p-4 md:p-8 whitespace-pre-line">{completion}</section>
      <footer class="card-footer flex justify-between items-center space-x-4">
        <button
          type="button"
          class="btn-icon btn-icon-sm bg-initial"
          use:clipboard={completion}
          on:click={() => {
            copied = true;
            setTimeout(() => {
              copied = false;
            }, 1000);
          }}
        >
          {#if copied}
            <ThumbsUp />
          {:else}
            <Copy />
          {/if}
        </button>
        <button
          type="button"
          class="btn-icon btn-icon-sm bg-initial"
          on:click={() => {
             dispatch('accepted');
          }}
        >
          <ArrowUpFromLine />
        </button>
      </footer>
    {:else}
      <section class="p-4 md:p-8"></section>
      <footer class="card-footer"></footer>
    {/if}
  {/if}
</div>
