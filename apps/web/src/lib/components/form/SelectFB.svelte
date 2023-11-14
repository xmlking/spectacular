<script lang="ts" context="module">
	// https://superforms.rocks/components#using-a-formfieldproxy
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { Helper, Label, Select } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let labelClasses = '';
	export let items: SelectOptionType[] = [];

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<Label color={$errors ? 'red' : 'gray'} for={field} class={labelClasses}>
	{label ?? path}
	<Select
		name={field}
		bind:value={$value}
		data-invalid={$errors}
		{items}
		aria-invalid={Boolean($errors)}
		aria-errormessage={Array($errors).join('. ')}
		aria-required="{$constraints?.required},"
		{...$constraints}
		{...$$restProps}
	/>
</Label>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
