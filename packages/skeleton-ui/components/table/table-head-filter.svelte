<script lang="ts" context="module">
	import type { Row } from '@vincjo/datatables';
	type T = Row;
</script>

<script lang="ts" generics="T extends Row">
	import type { DataHandler, Field, Comparator } from '@vincjo/datatables';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$ui/utils';
	import { getCtx } from './ctx';

	type $$Props = HTMLInputAttributes;
	let className: $$Props['class'] = undefined;
	export { className as class };

	export let handler: DataHandler<T>;
	export let filterBy: Field<T>;
	export let align: 'left' | 'right' | 'center' = 'left';
	export let comparator: Comparator<T> | null = null;

	handler ??= getCtx();

	let value: string = '';
	handler.on('clearFilters', () => (value = ''));
</script>

<th>
	<input
		style:text-align={align}
		type="text"
		placeholder={handler.i18n.filter}
		spellcheck="false"
		class={cn('input variant-form-material h-8 w-full text-sm', className)}
		{...$$restProps}
		bind:value
		on:input={() => handler.filter(value, filterBy, comparator)}
	/>
</th>
