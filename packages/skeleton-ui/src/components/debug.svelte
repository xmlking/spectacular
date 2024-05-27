<script lang="ts">
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import SuperDebug from 'sveltekit-superforms';
import { dev } from '$app/environment';
import { Icon } from '#components/icons/index.js';

export let data: any;
export let open = false;
export let label = 'Toggle SuperDebug';
export let status = true;
</script>

{#if dev}
  <br />
  <div class="card p-2">
    <Accordion>
      <AccordionItem {open}>
        <svelte:fragment slot="lead"><Icon name="debug" /></svelte:fragment>
        <svelte:fragment slot="summary">{label}</svelte:fragment>
        <svelte:fragment slot="content"><SuperDebug {status} {data} /></svelte:fragment>
      </AccordionItem>
    </Accordion>
  </div>
{/if}
