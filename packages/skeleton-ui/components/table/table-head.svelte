<script lang="ts" context="module">
	import type { Row } from '@vincjo/datatables';
	type T = Row;
</script>

<script lang="ts" generics="T extends Row">
	import { getContext } from '@spectacular/utils';
	import type { DataHandler, Field } from '@vincjo/datatables';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$ui/utils';
	import { handlerKey } from './keys';

	type $$Props = HTMLThAttributes;
	let className: $$Props['class'] = undefined;
	export { className as class };

	export let handler: DataHandler<T>;
	export let orderBy: Field<T>;
	export let align: 'left' | 'right' | 'center' = 'left';
	export let rowSpan: number = 1;

	handler ??= getContext(handlerKey);

	const identifier = orderBy?.toString();
	const sort = handler.getSort();
</script>

<th
	on:click={() => handler.sort(orderBy)}
	class:sortable={orderBy}
	class:active={$sort.identifier === identifier}
	rowspan={rowSpan}
	class={cn(' ', className)}
	{...$$restProps}
>
	<div
		class="flex"
		style:justify-content={align === 'left'
			? 'flex-start'
			: align === 'right'
				? 'flex-end'
				: 'center'}
	>
		<strong>
			<slot />
		</strong>
		<span class:asc={$sort.direction === 'asc'} class:desc={$sort.direction === 'desc'} />
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
