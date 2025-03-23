<script lang="ts">
import { getLoadingState } from '$lib/stores/loading';
import { ProgressRadial } from '@skeletonlabs/skeleton';
import { fade } from 'svelte/transition';

const { isLoading } = getLoadingState();

// Only show spinner if page transition takes more than 150ms
const wait = (delay: number) => new Promise((res) => setTimeout(res, delay));
</script>

{#if $isLoading}
  {#await wait(150) then}
    <div transition:fade|global>
      <ProgressRadial stroke={125} meter="stroke-secondary-500" track="stroke-primary-800/20" width="w-10" />
    </div>
  {/await}
{/if}
