<script lang="ts" module>
import type { Row } from '@vincjo/datatables/legacy';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler } from '@vincjo/datatables/legacy';
import type { HTMLTableAttributes } from 'svelte/elements';
import Search from './table-search.svelte';
import RowCount from './table-row-count.svelte';
import RowsPerPage from './table-rows-per-page.svelte';
import Pagination from './table-pagination.svelte';
import { setCtx } from './ctx.js';
import { cn } from '$lib/ui/utils';

type $$Props = HTMLTableAttributes;



  interface Props {
    class?: $$Props['class'];
    handler: DataHandler<T>;
    search?: boolean;
    rowsPerPage?: boolean;
    rowCount?: boolean;
    pagination?: boolean;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    class: className = undefined,
    handler,
    search = true,
    rowsPerPage = true,
    rowCount = true,
    pagination = true,
    children,
    ...rest
  }: Props = $props();

let element: HTMLElement = $state();
let clientWidth = $state(1000);

setCtx(handler);

const height = (search || rowsPerPage ? 48 : 8) + (rowCount || pagination ? 48 : 8);

handler.on('change', () => {
  if (element) element.scrollTop = 0;
});
</script>

<!-- FIXME: clientWidth `position:inherit` https://github.com/sveltejs/svelte/issues/4776 -->
<section bind:clientWidth class={cn('space-y-4', className)} style="position:inherit" {...rest}>
  <header class="flex justify-between">
    {#if search}
      <Search {handler} />
    {/if}
    {#if rowsPerPage}
      <RowsPerPage {handler} small={clientWidth < 600} />
    {/if}
  </header>

  <article bind:this={element} style="height:calc(100% - {height}px)">
    {@render children?.()}
  </article>

  <footer class="flex justify-between">
    {#if rowCount}
      <RowCount {handler} small={clientWidth < 600} />
    {/if}
    {#if pagination}
      <Pagination {handler} small={clientWidth < 600} />
    {/if}
  </footer>
</section>
