<script lang="ts" context="module">
	import type { Row } from '@vincjo/datatables';
	type T = Row;
</script>

<script lang="ts" generics="T extends Row">
	import type { DataHandler } from '@vincjo/datatables';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '#utils';
	import { getCtx } from './ctx.js';

	type $$Props = HTMLInputAttributes;
	let className: $$Props['class'] = undefined;
	export { className as class };

	export let handler: DataHandler<T>;
	let value = '';

	handler ??= getCtx();

	handler.on('clearSearch', () => (value = ''));
</script>

<input
	class={cn('input w-36 sm:w-64', className)}
	type="search"
	placeholder={handler.i18n.search}
	spellcheck="false"
	{...$$restProps}
	bind:value
	on:input={() => handler.search(value)}
/>
