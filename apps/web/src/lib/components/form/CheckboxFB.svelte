<script lang="ts" context="module">
	// https://superforms.rocks/components#using-a-formfieldproxy
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts">
	import { Checkbox, Helper } from 'flowbite-svelte';
	import type { Writable } from 'svelte/store';
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from './forms';

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
	$: checked = value as Writable<boolean>;
</script>

<Checkbox
	name={field}
	color={$errors ? 'red' : 'green'}
	bind:checked={$checked}
	data-invalid={$errors}
	aria-invalid={Boolean($errors)}
	aria-errormessage={Array($errors).join('. ')}
	aria-required={$constraints?.required}
	{...$constraints}
	{...$$restProps}
>
	<span class:text-error={$errors} class="label-text"><slot /></span>
</Checkbox>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
