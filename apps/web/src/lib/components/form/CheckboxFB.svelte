<script lang="ts">
	import { Checkbox, Helper } from 'flowbite-svelte';
	import type { Writable } from 'svelte/store';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let field: FormPathLeaves<z.infer<T>>;

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
	$: checked = value as Writable<boolean>;
</script>

<Checkbox
	name={field}
	color={$errors ? 'red' : 'secondary'}
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
