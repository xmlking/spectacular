<script lang="ts" module>
import type { Row } from '@vincjo/datatables/legacy';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler, Field } from '@vincjo/datatables/legacy';
import type { HTMLThAttributes } from 'svelte/elements';
import { getCtx } from './ctx.js';
import { cn } from '$lib/ui/utils';

type $$Props = HTMLThAttributes;


  interface Props {
    class?: $$Props['class'];
    handler: DataHandler<T>;
    orderBy: Field<T>;
    align?: 'left' | 'right' | 'center';
    rowSpan?: number;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    class: className = undefined,
    handler = $bindable(),
    orderBy,
    align = 'left',
    rowSpan = 1,
    children,
    ...rest
  }: Props = $props();

handler ??= getCtx();

const identifier = orderBy?.toString();
const sort = handler.getSort();
</script>

<th
  onclick={() => handler.sort(orderBy)}
  class:sortable={orderBy}
  class:active={$sort.identifier === identifier}
  rowspan={rowSpan}
  class={cn(' ', className)}
  {...rest}
>
  <div class="flex" style:justify-content={align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'}>
    <strong>
      {@render children?.()}
    </strong>
    <span class:asc={$sort.direction === 'asc'} class:desc={$sort.direction === 'desc'}></span>
  </div>
</th>

<style>
th {
  background: inherit;
  margin: 0;
  padding: 8px 20px;
  user-select: none;
}
th {
  cursor: pointer;
}
th div.flex {
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}
th span {
  padding-left: 8px;
}
th span:before,
th span:after {
  border: 4px solid transparent;
  content: '';
  display: block;
  height: 0;
  width: 0;
}
th span:before {
  border-bottom-color: #e0e0e0;
  margin-top: 2px;
}
th span:after {
  border-top-color: #e0e0e0;
  margin-top: 2px;
}
th.active span.asc:before {
  border-bottom-color: #9e9e9e;
}
th.active span.desc:after {
  border-top-color: #9e9e9e;
}
</style>
