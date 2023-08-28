<script lang="ts">
	import { Helper, Label } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import { getFormContext, type RadioOptionType } from './forms';

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
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
<div class="join">
	{#each items as item}
		<input
			type="radio"
			name={field}
			bind:group={$value}
			data-invalid={$errors}
			on:blur
			on:change
			on:click
			value={item.value}
			aria-label={item.label}
			class="join-item btn"
			{...$constraints}
			{...$$restProps}
		/>
	{/each}
</div>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
