<script lang="ts" context="module">
	// https://superforms.rocks/components#using-a-formfieldproxy
  	import type { AnyZodObject } from 'zod';
  	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { Helper, Label, Textarea } from 'flowbite-svelte';
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client'
	import { formFieldProxy } from 'sveltekit-superforms/client'
	import { getFormContext } from './forms';

	export let form: SuperForm<ZodValidation<T>, unknown>;
  	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

{#if label}
	<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label>
{/if}
<Textarea
	name={field}
	bind:value={$value}
	data-invalid={$errors}
	rows="4"
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
