<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { FloatingLabelInput, Helper } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { dateProxy, formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label = '';
	export let type: 'date' | 'datetime-local' = 'date';
	export let size: 'small' | 'default' = 'default';
	export let style: 'filled' | 'outlined' | 'standard' = 'outlined';

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
	let proxy: Writable<string> | undefined;
	if (type === 'date') {
		proxy = dateProxy(superform.form, field, { format: 'date', empty: 'null' });
	} else if (type === 'datetime-local') {
		// proxy = dateProxy(superform.form, field, { format: 'datetime-utc', empty: 'null' });
		proxy = dateProxy(superform.form, field, { format: 'datetime-local', empty: 'null' });
	}
	// $: console.log('date proxy----', path, $proxy)
	// $: console.log('date value----', path, $value)
</script>

<FloatingLabelInput
	{type}
	{style}
	{size}
	{label}
	name={field}
	bind:value={$proxy}
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

<style lang="postcss">
	[data-invalid],
	.invalid {
		color: red;
	}
</style>
