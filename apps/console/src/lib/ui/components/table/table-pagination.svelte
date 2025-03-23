<script lang="ts" module>
import type { Row } from '@vincjo/datatables/legacy';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler } from '@vincjo/datatables/legacy';
import type { HTMLAttributes } from 'svelte/elements';
import { getCtx } from './ctx.js';
import { cn } from '$lib/ui/utils';

type $$Props = HTMLAttributes<HTMLTableSectionElement>;


  interface Props {
    class?: $$Props['class'];
    handler: DataHandler<T>;
  }

  let { class: className = undefined, handler = $bindable() }: Props = $props();
// export let small = false

handler ??= getCtx();

const pageNumber = handler.getPageNumber();
const pageCount = handler.getPageCount();
const pages = handler.getPages({ ellipsis: true });
</script>

<!-- Desktop buttons -->
<section class={cn('variant-ghost-surface btn-group hidden h-10 lg:block [&>*+*]:border-surface-500', className)}>
  <button type="button" class:disabled={$pageNumber === 1} onclick={() => handler.setPage('previous')}> ← </button>
  {#each $pages as page}
    <button
      type="button"
      class:active={$pageNumber === page}
      class:ellipse={page === null}
      onclick={() => handler.setPage(page)}
    >
      {page ?? '...'}
    </button>
  {/each}
  <button type="button" class:disabled={$pageNumber === $pageCount} onclick={() => handler.setPage('next')}>
    →
  </button>
</section>

<!-- Mobile buttons -->
<section class={cn('lg:hidden', className)}>
  <button
    type="button"
    class:disabled={$pageNumber === 1}
    onclick={() => handler.setPage('previous')}
    class="variant-ghost-surface btn mb-2 mr-2"
  >
    ←
  </button>
  <button
    type="button"
    class:disabled={$pageNumber === $pageCount}
    onclick={() => handler.setPage('next')}
    class="variant-ghost-surface btn mb-2"
  >
    →
  </button>
</section>
