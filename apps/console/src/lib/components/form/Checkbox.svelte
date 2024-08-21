<script lang="ts">
	/**
	 * <div class="flex justify-start">
	 *   <Checkbox field={keys.active} class="toggle toggle-secondary" labelPosition="before" disabled={editMode}>Active</Checkbox>
	 *   <Checkbox field={keys.active} class="toggle toggle-secondary" disabled={editMode}>Active</Checkbox>
	 *   <Checkbox field={keys.active} class="w-4 h-4" disabled={editMode}>Active</Checkbox>
	 * </div>
	 */
	import { clsx } from 'clsx';
	import { Helper } from 'flowbite-svelte';
	import type { Writable } from 'svelte/store';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let labelClasses = '';
	export let labelPosition: 'before' | 'after' = 'after';

	const defaultLabelClasses = 'label cursor-pointer';
	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
	$: checked = value as Writable<boolean>;
</script>

<label class={clsx(defaultLabelClasses, labelClasses)}>
	{#if labelPosition == 'before'}
		<span class:text-error={$errors} class="label-text pr-2"><slot /></span>
	{/if}
	<input
		type="checkbox"
		name={field}
		bind:checked={$checked}
		data-invalid={$errors}
		aria-invalid={Boolean($errors)}
		aria-errormessage={Array($errors).join('. ')}
		aria-required={$constraints?.required}
		{...$constraints}
		{...$$restProps}
	/>
	{#if labelPosition == 'after'}
		<span class:text-error={$errors} class="label-text pl-2"><slot /></span>
	{/if}
</label>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
