<script lang="ts" context="module">
	// https://superforms.rocks/components#using-a-formfieldproxy
  	import type { AnyZodObject } from 'zod';
  	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { Helper, Label } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client'
	import { formFieldProxy } from 'sveltekit-superforms/client'
	import { getFormContext } from './forms';

	export let form: SuperForm<ZodValidation<T>, unknown>;
  	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let labelClasses = '';
	export let items: SelectOptionType[] = [];

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

{#if label}
	<Label color={$errors ? 'red' : 'gray'} for={field} class={labelClasses}>{label ?? path}</Label>
{/if}
<select
	class="select-bordered select w-full focus:outline-none"
	name={field}
	bind:value={$value}
	data-invalid={$errors}
	aria-invalid={Boolean($errors)}
	aria-errormessage={Array($errors).join('. ')}
	aria-required={$constraints?.required}
	{...$constraints}
	{...$$restProps}
>
	{#each items as item}
		<option value={item.value}>
			{item.name}
		</option>
	{/each}
</select>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
