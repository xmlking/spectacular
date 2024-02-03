<script lang="ts" context="module">
	// https://superforms.rocks/components#using-a-formfieldproxy
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { ButtonGroup, RadioButton, Helper, Label } from 'flowbite-svelte';
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import generateId from '$lib/utils/generateId';
	import { getFormContext } from './forms';
	import type { RadioOptionType } from './forms';

	export let form: SuperForm<ZodValidation<T>, unknown>;
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
		<!-- <Button outline class="checked-label" {...$$restProps}>
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
	</Button> -->
		<RadioButton
			outline
			{...$$restProps}
			{id}
			name={field}
			value={item.value}
			bind:group={$value}
			on:blur
			on:change
			on:click
			aria-label={item.label}
			data-invalid={$errors}
			{...$constraints}
			{...$$restProps}
		>
			{item.label}
		</RadioButton>
	{/each}
</ButtonGroup>

{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}

<style lang="postcss">
	/* TODO: has to define in apps/console/src/app.pcss */
	/* @layer components {
  .checked-label:has(input:checked) {
    @apply bg-primary-700 text-white;
  }
} */
</style>
