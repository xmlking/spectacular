<script lang="ts">
import { dev } from '$app/environment';
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import { Icon } from '$lib/ui/components/icons/index.js';

  interface Props {
    open?: boolean;
    label?: string;
    children?: import('svelte').Snippet;
  }

  let { open = false, label = 'Toggle SuperDebug', children }: Props = $props();
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
                {@render children?.()}
              {/snippet}
      </AccordionItem>
    </Accordion>
  </div>
{/if}
