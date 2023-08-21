<script lang="ts">
	import { Helper, Input, Label } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let type: InputType = 'text';

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label ?? path}</Label>
<Input
	{type}
	name={field}
	bind:value={$value}
	data-invalid={$errors}
	color={$errors ? 'red' : 'base'}
	aria-invalid={Boolean($errors)}
	aria-errormessage={Array($errors).join('. ')}
	aria-required="{$constraints?.required},"
	{...$constraints}
	{...$$restProps}
/>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
