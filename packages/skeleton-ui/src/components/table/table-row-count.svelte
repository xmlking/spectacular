<script lang="ts" context="module">
import type { Row } from '@vincjo/datatables';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler } from '@vincjo/datatables';
import type { HTMLAttributes } from 'svelte/elements';
import { getCtx } from './ctx.js';
import { cn } from '#utils';

type $$Props = HTMLAttributes<HTMLTableSectionElement>;
let className: $$Props['class'] = undefined;
export { className as class };

export let handler: DataHandler<T>;
export let small = false;

handler ??= getCtx();

const rowCount = handler.getRowCount();
</script>

<aside class={cn('mr-6 text-sm leading-8', className)}>
  {#if small}
    {#if $rowCount.total > 0}
      <b>{$rowCount.start}</b>-
      <b>{$rowCount.end}</b>/
      <b>{$rowCount.total}</b>
    {:else}
      {handler.i18n.noRows}
    {/if}
  {:else if $rowCount.total > 0}
    {@html handler.i18n.rowCount
      .replace('{start}', `<b>${$rowCount.start}</b>`)
      .replace('{end}', `<b>${$rowCount.end}</b>`)
      .replace('{total}', `<b>${$rowCount.total}</b>`)}
  {:else}
    {handler.i18n.noRows}
  {/if}
</aside>
