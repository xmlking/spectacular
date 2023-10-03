<script lang="ts" context="module">
	// https://superforms.rocks/components#using-a-formfieldproxy
  	import type { AnyZodObject } from 'zod';
  	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { FloatingLabelInput, Helper } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client'
	import { formFieldProxy } from 'sveltekit-superforms/client'
	import { getFormContext } from './forms';

	export let form: SuperForm<ZodValidation<T>, unknown>;
  	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let type: InputType = 'text';
	export let size: 'small' | 'default' = 'default';
	export let style: 'filled' | 'outlined' | 'standard' = 'outlined';

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FloatingLabelInput
	{type}
	{style}
	{size}
	{label}
	name={field}
	bind:value={$value}
	data-invalid={$errors}
	class="input-bordered input"
	color={$errors ? 'red' : 'base'}
	aria-describedby={`${path}_help`}
	aria-invalid={Boolean($errors)}
	aria-errormessage={Array($errors).join('. ')}
	aria-required="{$constraints?.required},"
	{...$constraints}
	{...$$restProps}
/>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
