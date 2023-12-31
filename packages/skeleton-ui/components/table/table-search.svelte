<script lang="ts" context="module">
	import type { Row } from '@vincjo/datatables';
	type T = Row;
</script>

<script lang="ts" generics="T extends Row">
	import { getContext } from '@spectacular/utils';
	import type { DataHandler } from '@vincjo/datatables';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$ui/utils';
	import { handlerKey } from './keys';

	type $$Props = HTMLInputAttributes;
	let className: $$Props['class'] = undefined;
	export { className as class };

	export let handler: DataHandler<T>;
	let value = '';

	handler ??= getContext(handlerKey);

	handler.on('clearSearch', () => (value = ''));
</script>

<input
	class={cn('input w-36 sm:w-64', className)}
	type="search"
	placeholder={handler.i18n.search}
	spellcheck="false"
	bind:value
	on:input={() => handler.search(value)}
/>
