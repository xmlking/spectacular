<script lang="ts">
	import { Tags } from '$lib/components';
	import { Helper } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let disabled = false;

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<!-- FIXME: add {...$constraints} -->
<div class="my-tag" color={$errors ? 'red' : 'base'}>
	<Tags
		name={field}
		bind:tags={$value}
		data-invalid={$errors}
		onlyUnique={true}
		minChars={3}
		labelText={label ?? path}
		labelShow
		disable={disabled}
		{...$$restProps}
	/>
</div>

{#if $errors}
	{#if $errors._errors}
		<Helper class="mt-2" color="red">{$errors._errors}</Helper>
	{:else}
		<Helper class="mt-2" color="red">{$errors}</Helper>
	{/if}
{/if}

<style lang="postcss">
	.my-tag :global(.svelte-tags-input-layout.sti-layout-disable),
	.my-tag :global(.svelte-tags-input:disabled) {
		background: rgb(249 250 251 / var(--tw-bg-opacity));
		cursor: not-allowed;
	}

	/*override svelte-tags-input default styles*/
	.my-tag :global(.svelte-tags-input-tag-remove) {
		cursor: pointer;
		padding-left: 1rem;
		font-size: 1rem;
		color: red;
	}

	.my-tag :global(.svelte-tags-input-layout) {
		@apply relative  rounded-lg  text-gray-900;
	}

	.my-tag :global(.svelte-tags-input-layout label) {
		/* eslint-disable */
		@apply absolute left-1 top-0.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500;
	}

	.my-tag :global(.svelte-tags-input) {
		@apply block w-full appearance-none rounded-lg border-gray-300 bg-transparent p-2 text-sm text-gray-900 focus:border-primary-700 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500;
	}

	.my-tag :global(.svelte-tags-input-layout:focus-within) {
		outline: -webkit-focus-ring-color;
	}

	.my-tag :global(.svelte-tags-input-layout:focus) {
		border: solid 1px var(--tw-ring-color);
	}
	.my-tag :global(.svelte-tags-input-layout:hover) {
		/* border: solid 1px var(--tw-ring-color); */
		@apply border-primary-700;
	}

	[data-invalid],
	.invalid {
		color: red;
	}
</style>
