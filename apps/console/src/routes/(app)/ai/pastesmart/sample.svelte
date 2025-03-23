     <script lang="ts">
import { clipboard } from '@skeletonlabs/skeleton';
import { Copy, ThumbsUp } from 'lucide-svelte';
import { createEventDispatcher } from 'svelte';


  interface Props {
    // Props
    header: string;
    content: string;
  }

  let { header, content }: Props = $props();

// Variables
let copied: boolean = $state();
const dispatch = createEventDispatcher();
</script>

<div class="card variant-soft mt-4">
  <header class="card-header font-semibold">{header}</header>
  <section class="p-4 md:p-8 whitespace-pre-line">{content}</section>
  <footer class="card-footer flex justify-between items-center space-x-4">
    <button
      type="button"
      title="Copy to Clipboard"
      class="btn-icon btn-icon-sm bg-initial"
      use:clipboard={content}
      onclick={() => {
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
</div>
