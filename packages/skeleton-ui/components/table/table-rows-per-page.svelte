<script lang="ts" context="module">
	import type { Row } from '@vincjo/datatables';
	type T = Row;
</script>

<script lang="ts" generics="T extends Row">
	import { getContext } from '@spectacular/utils';
	import type { DataHandler } from '@vincjo/datatables';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { cn } from '$ui/utils';
	import { handlerKey } from './keys';

	type $$Props = HTMLSelectAttributes;
	let className: $$Props['class'] = undefined;
	export { className as class };

	export let handler: DataHandler<T>;
	export let small = false;

	handler ??= getContext(handlerKey);

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
		on:change={() => handler.setPage(1)}
		{...$$restProps}
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
