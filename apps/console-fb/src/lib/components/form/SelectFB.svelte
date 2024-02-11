<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<!-- <script lang="ts" generics="T extends Record<string, unknown>"> -->
<script lang="ts">
	import { Helper, Label, Select } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms';
	import { getFormContext } from './forms';

	// eslint-disable-next-line no-undef
	export let form: SuperForm<T, unknown>;
	export let field: FormPathLeaves<T>;
	export let label = '';
	export let labelClasses = '';
	export let items: SelectOptionType<any>[] = [];

	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<Label color={$errors ? 'red' : 'gray'} for={field} class={labelClasses}>
	{label ?? path}
	<Select
		name={field}
		bind:value={$value}
		data-invalid={$errors}
		{items}
		aria-invalid={Boolean($errors)}
		aria-errormessage={Array($errors).join('. ')}
		aria-required="{$constraints?.required},"
		{...$constraints}
		{...$$restProps}
	/>
</Label>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
