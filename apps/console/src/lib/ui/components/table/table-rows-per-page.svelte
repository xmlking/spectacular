<script lang="ts" module>
import type { Row } from '@vincjo/datatables/legacy';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler } from '@vincjo/datatables/legacy';
import type { HTMLSelectAttributes } from 'svelte/elements';
import { getCtx } from './ctx.js';
import { cn } from '$lib/ui/utils';

type $$Props = HTMLSelectAttributes;


  interface Props {
    class?: $$Props['class'];
    handler: DataHandler<T>;
    small?: boolean;
    [key: string]: any
  }

  let { class: className = undefined, handler = $bindable(), small = false, ...rest }: Props = $props();

handler ??= getCtx();

const rowsPerPage = handler.getRowsPerPage();

const options = [5, 10, 20, 50, 100];
</script>

<aside class="flex place-items-center">
  {#if !small}
    <span>{handler.i18n.show}</span>
  {/if}
  <select
    class={cn('select ml-2', className)}
    bind:value={$rowsPerPage}
    onchange={() => handler.setPage(1)}
    {...rest}
  >
    {#each options as option}
      <option value={option}>
        {option}
      </option>
    {/each}
  </select>
  <!-- {#if !small}
        <span>{handler.i18n.entries}</span>
    {/if} -->
</aside>
