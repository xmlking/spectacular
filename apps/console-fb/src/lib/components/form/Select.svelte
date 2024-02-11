<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<!-- <script lang="ts" generics="T extends Record<string, unknown>"> -->
<script lang="ts">
	import { Helper, Label } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms';
	import { getFormContext } from './forms';

	export let form: SuperForm<T, unknown>;
	export let field: FormPathLeaves<T>;
	export let label = '';
	export let labelClasses = '';
	export let items: SelectOptionType<any>[] = [];

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
