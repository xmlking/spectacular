<script lang="ts">
import { dev } from '$app/environment';
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import SuperDebug from 'sveltekit-superforms';
import { Icon } from '$lib/ui/components/icons/index.js';

  interface Props {
    data: any;
    open?: boolean;
    label?: string;
    status?: boolean;
  }

  let {
    data,
    open = false,
    label = 'Toggle SuperDebug',
    status = true
  }: Props = $props();
</script>

{#if dev}
  <br />
  <div class="card p-2">
    <Accordion>
      <AccordionItem {open}>
        {#snippet lead()}
                <Icon name="debug" />
              {/snippet}
        {#snippet summary()}
                {label}
              {/snippet}
        {#snippet content()}
                <SuperDebug {status} {data} />
              {/snippet}
      </AccordionItem>
    </Accordion>
  </div>
{/if}
