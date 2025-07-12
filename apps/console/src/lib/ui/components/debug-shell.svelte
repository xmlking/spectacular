<script lang="ts">
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import { dev } from '$app/environment';
import { Icon } from '$lib/ui/components/icons/index.js';

export let open = false;
export let label = 'Toggle SuperDebug';
</script>

{#if dev}
  <br />
  <div class="card p-2">
    <Accordion>
      <AccordionItem {open}>
        <svelte:fragment slot="lead"><Icon name="debug" /></svelte:fragment>
        <svelte:fragment slot="summary">{label}</svelte:fragment>
        <svelte:fragment slot="content"><slot /></svelte:fragment>
      </AccordionItem>
    </Accordion>
  </div>
{/if}
