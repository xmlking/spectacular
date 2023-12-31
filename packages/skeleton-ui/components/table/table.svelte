<script lang="ts" context="module">
	import type { Row } from '@vincjo/datatables';
	type T = Row;
</script>

<script lang="ts" generics="T extends Row">
	import { onMount } from 'svelte';
	import type { DataHandler } from '@vincjo/datatables';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { setContext } from '@spectacular/utils';
	import { cn } from '$ui/utils';
	import Search from './table-search.svelte';
	import RowCount from './table-row-count.svelte';
	import RowsPerPage from './table-rows-per-page.svelte';
	import Pagination from './table-pagination.svelte';
	import { handlerKey } from './keys';

	type $$Props = HTMLTableAttributes;
	let className: $$Props['class'] = undefined;
	export { className as class };

	export let handler: DataHandler<T>;

	export let search = true;
	export let rowsPerPage = true;
	export let rowCount = true;
	export let pagination = true;

	let element: HTMLElement;
	let clientWidth = 1000;

	setContext(handlerKey, handler);

	const height = (search || rowsPerPage ? 48 : 8) + (rowCount || pagination ? 48 : 8);

	handler.on('change', () => {
		if (element) element.scrollTop = 0;
	});

	onMount(() => {
		console.log('position', element.style.position)
		if (element) element.style.position=""
		console.log('position', element.style.position)
	})

</script>

<!-- FIXME: clientWidth https://github.com/sveltejs/svelte/issues/4776 -->
<section
	bind:clientWidth
	class={cn('mx-[10%] my-4 space-y-2 overflow-x-auto', className)}
	{...$$restProps}
>
	<header class="flex justify-between">
		{#if search}
			<Search {handler} />
		{/if}
		{#if rowsPerPage}
			<RowsPerPage {handler} small={clientWidth < 600} />
		{/if}
	</header>

	<article bind:this={element} style="height:calc(100% - {height}px)">
		<slot />
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
