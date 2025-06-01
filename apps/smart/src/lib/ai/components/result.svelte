<script lang="ts">
import { copy } from '@repo/ui/actions/index.js';
import { Copy, ThumbsUp } from '@lucide/svelte';

// Props
export let loading: boolean;
export let header: string;
export let placeholder: string;
export let completion: string;
export let error: string;

// Variables
let copied: boolean;
let reslutContainer: HTMLElement;
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
      <section class="p-4 md:p-8 whitespace-pre-line" bind:this={reslutContainer}>{completion}</section>
      <footer class="card-footer">
        <button
          type="button"
          class="btn-icon btn-icon-sm bg-initial"
          use:copy={reslutContainer}
          on:!copy={() => {
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
      </footer>
    {:else}
      <section class="p-4 md:p-8"></section>
      <footer class="card-footer"></footer>
    {/if}
  {/if}
</div>
