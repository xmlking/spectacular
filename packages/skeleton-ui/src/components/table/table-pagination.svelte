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
	// export let small = false

	handler ??= getCtx();

	const pageNumber = handler.getPageNumber();
	const pageCount = handler.getPageCount();
	const pages = handler.getPages({ ellipsis: true });
</script>

<!-- Desktop buttons -->
<section
	class={cn(
		'variant-ghost-surface btn-group hidden h-10 lg:block [&>*+*]:border-surface-500',
		className
	)}
>
	<button
		type="button"
		class:disabled={$pageNumber === 1}
		on:click={() => handler.setPage('previous')}
	>
		←
	</button>
	{#each $pages as page}
		<button
			type="button"
			class:active={$pageNumber === page}
			class:ellipse={page === null}
			on:click={() => handler.setPage(page)}
		>
			{page ?? '...'}
		</button>
	{/each}
	<button
		type="button"
		class:disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage('next')}
	>
		→
	</button>
</section>

<!-- Mobile buttons -->
<section class={cn('lg:hidden', className)}>
	<button
		type="button"
		class:disabled={$pageNumber === 1}
		on:click={() => handler.setPage('previous')}
		class="variant-ghost-surface btn mb-2 mr-2"
	>
		←
	</button>
	<button
		type="button"
		class:disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage('next')}
		class="variant-ghost-surface btn mb-2"
	>
		→
	</button>
</section>
