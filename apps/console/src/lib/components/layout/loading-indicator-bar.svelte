<script lang="ts">
import { getLoadingState } from '$lib/stores/loading';
import { ProgressBar } from '@skeletonlabs/skeleton';
import { fade } from 'svelte/transition';

// const { isLoading } = getLoadingState();
const loadingState = getLoadingState(); // HINT: `loadingState` is also subscribable

// Only show spinner if page transition takes more than 150ms
const wait = (delay: number) => new Promise((res) => setTimeout(res, delay));
</script>

{#if $loadingState}
  {#await wait(150) then}
    <div transition:fade|global>
      <div class="absolute inset-x-0 top-0 w-full">
        <ProgressBar meter="bg-primary-500" track="bg-primary-500/30" />
        <!-- <ProgressBar meter="bg-secondary-500" track="bg-secondary-500/30" /> -->
        <!-- <ProgressBar meter="bg-tertiary-500" track="bg-tertiary-500/30" /> -->
        <!-- <ProgressBar meter="bg-success-500" track="bg-success-500/30" /> -->
        <!-- <ProgressBar meter="bg-warning-500" track="bg-warning-500/30" /> -->
        <!-- <ProgressBar meter="bg-error-500" track="bg-error-500/30" /> -->
      </div>
    </div>
  {/await}
{/if}
