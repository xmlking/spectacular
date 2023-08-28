<script lang="ts">
	import generateId from '$lib/utils/generateId';
	import { Button, ButtonGroup, Helper, Label } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext, type RadioOptionType } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let labelClasses = '';
	export let items: RadioOptionType[] = [];

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

{#if label}
	<Label color={$errors ? 'red' : 'gray'} for={field} class={labelClasses}>{label ?? path}</Label>
{/if}
<ButtonGroup>
	{#each items as item}
		 {@const id = generateId()}
		<Button outline class="checked-label" {...$$restProps}>
			<input
				type="radio"
				{id}
				name={field}
				bind:group={$value}
				data-invalid={$errors}
				on:blur
				on:change
				on:click
				value={item.value}
				aria-label={item.label}
				class="peer hidden"
				{...$constraints}
				{...$$restProps}
			/>
			<label for={id} >{item.label}</label>
	</Button>
	{/each}
</ButtonGroup>

{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}

<style lang="postcss">
/* TODO: has to define in apps/web/src/app.pcss */
/* @layer components {
  .checked-label:has(input:checked) {
    @apply bg-primary-700 text-white;
  }
} */
</style>
